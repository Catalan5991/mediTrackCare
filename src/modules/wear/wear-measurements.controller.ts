import { Body, Controller, Get, Headers, Injectable, Module, Post, UnauthorizedException } from '@nestjs/common';
import { IsEnum, IsNumber, IsOptional, Max, MaxLength, Min, IsString, ValidateIf } from 'class-validator';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/infrastructure/decorators/public.decorator';
import { MeasurementType } from '../../../generated/prisma/client';

class WearMeasurementDto {
  @IsEnum(MeasurementType) type!: MeasurementType;
  @IsNumber() @Min(1) @Max(1000) value!: number;
  @IsOptional() @IsNumber() @Min(1) @Max(500) secondValue?: number;
  @IsOptional() @IsString() @MaxLength(255) notes?: string;
}

@Injectable()
class WearMeasurementsService {
  constructor(private readonly prisma: PrismaService) {}
  private async actor(token?: string) {
    if (!token || !/^[a-f0-9]{64}$/.test(token)) throw new UnauthorizedException('Reloj no autorizado');
    const hash = createHash('sha256').update(token).digest('hex');
    const device = await this.prisma.wearDevice.findUnique({
      where: {tokenHash: hash}, include: {user: {include:{patientProfile:true}}},
    });
    if (!device || device.revokedAt || !device.user.isActive || !device.user.patientProfile?.isActive)
      throw new UnauthorizedException('Vinculación revocada');
    return {userId:device.userId, patientId:device.user.patientProfile.id};
  }
  async list(token?:string) {
    const actor=await this.actor(token);
    return this.prisma.medicalMeasurement.findMany({
      where:{patientId:actor.patientId},
      select:{id:true,measurementType:true,value:true,secondValue:true,unit:true,measuredAt:true},
      orderBy:{measuredAt:'desc'},take:25,
    });
  }
  async create(token:string|undefined, dto:WearMeasurementDto) {
    const actor=await this.actor(token);
    if (dto.type === MeasurementType.PRESION_ARTERIAL) {
      if (dto.value<40 || dto.value>300 || dto.secondValue===undefined ||
          dto.secondValue<20 || dto.secondValue>200 || dto.secondValue>=dto.value)
        throw new UnauthorizedException('Valores de presión no válidos.');
    } else if (dto.secondValue !== undefined) {
      throw new UnauthorizedException('Segunda medición no permitida.');
    }
    const unit = dto.type === MeasurementType.PRESION_ARTERIAL ? 'mmHg'
      : dto.type === MeasurementType.GLUCOSA ? 'mg/dL'
      : dto.type === MeasurementType.FRECUENCIA_CARDIACA ? 'lpm'
      : dto.type === MeasurementType.SATURACION_OXIGENO ? '%'
      : dto.type === MeasurementType.TEMPERATURA ? '°C' : 'kg';
    if (dto.type === MeasurementType.GLUCOSA && (dto.value<20||dto.value>600))
      throw new UnauthorizedException('Valor fuera del intervalo aceptado.');
    if (dto.type === MeasurementType.SATURACION_OXIGENO && dto.value>100)
      throw new UnauthorizedException('Valor fuera del intervalo aceptado.');
    return this.prisma.medicalMeasurement.create({
      data:{patientId:actor.patientId,registeredByUserId:actor.userId,
        measurementType:dto.type,value:dto.value,secondValue:dto.secondValue,
        unit,notes:dto.notes,measuredAt:new Date()},
      select:{id:true,measurementType:true,measuredAt:true},
    });
  }
}
@Controller('wear/measurements')
export class WearMeasurementsController {
  constructor(private readonly service:WearMeasurementsService) {}
  @Public() @Get() list(@Headers('x-wear-token') token?:string) {return this.service.list(token);}
  @Public() @Post() create(@Headers('x-wear-token') token:string|undefined,@Body() dto:WearMeasurementDto) {
    return this.service.create(token,dto);
  }
}
@Module({controllers:[WearMeasurementsController],providers:[WearMeasurementsService,PrismaService]})
export class WearMeasurementsModule {}
