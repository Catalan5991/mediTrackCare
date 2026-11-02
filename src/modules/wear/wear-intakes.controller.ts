import { BadRequestException, Body, Controller, ForbiddenException, Get, Headers, Injectable, Module, Param, ParseIntPipe, Post, UnauthorizedException } from '@nestjs/common';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/infrastructure/decorators/public.decorator';
import { localDate, localInstant, addDays } from '../prescriptions/domain/schedule';
import { TreatmentIntakeStatus } from '../../../generated/prisma/client';

class WearIntakeDto {
  @IsDateString() scheduledAt!: string;
  @IsEnum(TreatmentIntakeStatus) status!: TreatmentIntakeStatus;
  @IsOptional() @IsString() @MaxLength(255) notes?: string;
}
@Injectable()
class WearIntakesService {
  constructor(private readonly db: PrismaService) {}

  private async actor(token?: string) {
    if (!token || !/^[a-f0-9]{64}$/.test(token)) throw new UnauthorizedException('Credencial inválida.');
    const hash = createHash('sha256').update(token).digest('hex');
    const device = await this.db.wearDevice.findUnique({
      where: { tokenHash: hash }, include: { user: { include: { patientProfile: true } } },
    });
    if (!device || device.revokedAt || !device.user.isActive ||
        !device.user.patientProfile?.isActive)
      throw new UnauthorizedException('Dispositivo no autorizado.');
    return { userId: device.userId, patientId: device.user.patientProfile.id };
  }

  private slots(t: {startDate:Date|null;endDate:Date|null;scheduledTimes:string[];daysOfWeek:number[];timeZone:string}, date:string) {
    const start=t.startDate?.toISOString().slice(0,10);
    const end=t.endDate?.toISOString().slice(0,10);
    if (!start || date<start || (end && date>end)) return [];
    const day=new Date(date+'T00:00:00Z').getUTCDay();
    if (t.daysOfWeek.length && !t.daysOfWeek.includes(day)) return [];
    return t.scheduledTimes.map(time=>localInstant(date,time,t.timeZone))
      .filter((x):x is Date=>x!==null).sort((a,b)=>a.getTime()-b.getTime());
  }

  async today(token?:string) {
    const actor=await this.actor(token);
    const patient=await this.db.patient.findUniqueOrThrow({where:{id:actor.patientId}});
    const today=localDate(new Date(),patient.timeZone);
    const treatments=await this.db.patientTreatment.findMany({
      where:{patientId:actor.patientId,status:'ACTIVE'},
      include:{medication:true,intakes:{where:{scheduledAt:{gte:new Date(today+'T00:00:00Z'),lte:new Date(addDays(today,2)+'T00:00:00Z')}}}},
      take:100,
    });
    const now=new Date();
    const data=treatments.flatMap(t=>this.slots(t,today).map(at=>{
      const recorded=t.intakes.find(i=>i.scheduledAt?.getTime()===at.getTime());
      const next=[...this.slots(t,today),...this.slots(t,addDays(today,1))].find(x=>x>at);
      const status=recorded?.status==='TAKEN'?'TOMADA':recorded?.status==='SKIPPED'?'OMITIDA':
        next&&next<=now?'VENCIDA_SIN_CONFIRMAR':at<=now?'RETRASADA':'PENDIENTE';
      return {treatmentId:t.id,medication:t.medication.name,dose:t.dose,doseUnit:t.doseUnit,
        scheduledAt:at.toISOString(),status,canConfirm:status==='RETRASADA',canSkip:status==='RETRASADA'||status==='VENCIDA_SIN_CONFIRMAR'};
    })).sort((a,b)=>a.scheduledAt.localeCompare(b.scheduledAt));
    return {date:today,timeZone:patient.timeZone,data};
  }

  async record(token:string|undefined,id:number,dto:WearIntakeDto) {
    const actor=await this.actor(token);
    const treatment=await this.db.patientTreatment.findUnique({where:{id}});
    if (!treatment || treatment.patientId!==actor.patientId || treatment.status!=='ACTIVE')
      throw new ForbiddenException('Tratamiento no autorizado.');
    const scheduledAt=new Date(dto.scheduledAt);
    const now=new Date();
    if (!Number.isFinite(scheduledAt.getTime()) || scheduledAt>now)
      throw new BadRequestException('Horario inválido o futuro.');
    const day=localDate(scheduledAt,treatment.timeZone);
    if (!this.slots(treatment,day).some(x=>x.getTime()===scheduledAt.getTime()))
      throw new BadRequestException('Horario no programado.');
    const following=[...this.slots(treatment,day),...this.slots(treatment,addDays(day,1))]
      .find(x=>x>scheduledAt);
    if(dto.status===TreatmentIntakeStatus.TAKEN && following && following<=now)
      throw new BadRequestException('La toma ya venció al comenzar el siguiente horario.');
    if(dto.status!==TreatmentIntakeStatus.TAKEN && dto.status!==TreatmentIntakeStatus.SKIPPED)
      throw new BadRequestException('Estado no permitido.');
    return this.db.$transaction(async tx=>{
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(880, ${id})`;
      const registered=await tx.patientTreatmentIntake.findFirst({where:{patientTreatmentId:id,scheduledAt}});
      if(registered) throw new BadRequestException('Esta toma ya se registró.');
      const intake=await tx.patientTreatmentIntake.create({
        data:{patientTreatmentId:id,recordedByUserId:actor.userId,status:dto.status,
          scheduledAt,takenAt:dto.status===TreatmentIntakeStatus.TAKEN?new Date():null,notes:dto.notes}
      });
      await tx.notification.updateMany({
        where:{deduplicationKey:{startsWith:'personal:'+id+':'+scheduledAt.toISOString()+':'},status:'PENDIENTE'},
        data:{cancelledAt:new Date()}
      });
      await tx.auditLog.create({data:{userId:actor.userId,module:'wear-intakes',action:'INTAKE',
        entityName:'PatientTreatmentIntake',entityId:intake.id,
        description:JSON.stringify({treatmentId:id,status:dto.status})}});
      return {id:intake.id,status:intake.status,scheduledAt:intake.scheduledAt};
    });
  }
}
@Controller('wear/intakes')
export class WearIntakesController {
  constructor(private readonly service:WearIntakesService){}
  @Public() @Get('today') today(@Headers('x-wear-token') token?:string) {return this.service.today(token);}
  @Public() @Post(':id') record(
    @Headers('x-wear-token') token:string|undefined,
    @Param('id',ParseIntPipe) id:number,
    @Body() dto:WearIntakeDto,
  ) {return this.service.record(token,id,dto);}
}
@Module({controllers:[WearIntakesController],providers:[WearIntakesService,PrismaService]})
export class WearIntakesModule {}
