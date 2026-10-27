import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PatientAccessService } from '../../../common/authorization/patient-access.service';
import { CreatePatientTreatmentDto, UpdatePatientTreatmentDto, RecordTreatmentIntakeDto } from '../application/treatment.dto';
import { TreatmentOrigin, TreatmentIntakeStatus } from '../../../../generated/prisma/client';

@Injectable()
export class PatientTreatmentsService {
  constructor(private readonly prisma: PrismaService, private readonly access: PatientAccessService) {}

  private verify(input: CreatePatientTreatmentDto) {
    if (input.origin === TreatmentOrigin.EXTERNAL_PRESCRIPTION && !input.dose?.trim())
      throw new BadRequestException('La transcripcion de una receta requiere la dosis indicada.');
    if (input.origin === TreatmentOrigin.SELF_REPORTED && (input.externalPrescriberName || input.externalPrescriptionDate))
      throw new BadRequestException('Un registro personal no debe presentarse como receta externa.');
    const times = input.scheduledTimes ?? [];
    if (new Set(times).size !== times.length || times.some(t => !/^([01]\d|2[0-3]):[0-5]\d$/.test(t)))
      throw new BadRequestException('Horarios inválidos o duplicados.');
    const days = input.daysOfWeek ?? [];
    if (new Set(days).size !== days.length || days.some(d => d < 0 || d > 6))
      throw new BadRequestException('Días inválidos o duplicados.');
    if (input.startDate && input.endDate && input.endDate < input.startDate)
      throw new BadRequestException('La fecha final debe ser posterior al inicio.');
  }

  private async authorize(patientId:number, action:'read'|'track'|'reminders'='read') {
    await this.access.assert(patientId, action);
  }
  private async get(id:number) {
    const item=await this.prisma.patientTreatment.findUnique({where:{id},include:{medication:true}});
    if(!item)throw new NotFoundException('Tratamiento no encontrado.');
    return item;
  }
  async create(dto:CreatePatientTreatmentDto) {
    this.verify(dto);
    // Only owners or explicitly authorized caregivers can add personal/external treatment records.
    if(this.access.actor().role.toUpperCase()==='DOCTOR')
      throw new ForbiddenException('Utiliza el servicio de prescripciones clínicas para médicos.');
    await this.authorize(dto.patientId,'reminders');
    return this.prisma.$transaction(async tx=>{
      const patient=await tx.patient.findUnique({where:{id:dto.patientId}});
      const medication=await tx.medication.findFirst({where:{id:dto.medicationId,isActive:true}});
      if(!patient?.isActive||!medication)throw new BadRequestException('Paciente o medicamento inexistente o inactivo.');
      const result=await tx.patientTreatment.create({data:{
        patientId:dto.patientId, medicationId:dto.medicationId, registeredByUserId:this.access.actor().id,
        origin:dto.origin, externalPrescriberName:dto.externalPrescriberName,
        externalPrescriptionDate:dto.externalPrescriptionDate?new Date(dto.externalPrescriptionDate):undefined,
        dose:dto.dose, doseUnit:dto.doseUnit, frequency:dto.frequency,
        instructions:dto.instructions, notes:dto.notes,
        startDate:dto.startDate?new Date(dto.startDate):undefined,
        endDate:dto.endDate?new Date(dto.endDate):undefined,
        scheduledTimes:dto.scheduledTimes??[], daysOfWeek:dto.daysOfWeek??[],
        timeZone:patient.timeZone,
      },include:{medication:true}});
      await tx.auditLog.create({data:{userId:this.access.actor().id,module:'patient-treatments',action:'CREATE',
        entityName:'PatientTreatment',entityId:result.id,description:JSON.stringify({origin:result.origin,patientId:result.patientId})}});
      return result;
    });
  }
  async list(patientId:number) {
    await this.authorize(patientId);
    return this.prisma.patientTreatment.findMany({where:{patientId},include:{medication:true},
      orderBy:{createdAt:'desc'},take:100});
  }
  async findOne(id:number) {
    const item=await this.get(id);await this.authorize(item.patientId);return item;
  }
  async update(id:number,dto:UpdatePatientTreatmentDto) {
    const old=await this.get(id);
    if(dto.patientId!==undefined&&dto.patientId!==old.patientId)throw new BadRequestException('No se puede cambiar de paciente.');
    if(dto.medicationId!==undefined&&dto.medicationId!==old.medicationId)throw new BadRequestException('Para cambiar de medicamento crea otro tratamiento.');
    if(dto.origin!==undefined&&dto.origin!==old.origin)throw new BadRequestException('No se puede alterar el origen del registro.');
    this.verify({
      patientId:old.patientId,medicationId:old.medicationId,origin:old.origin,
      externalPrescriberName:dto.externalPrescriberName??old.externalPrescriberName??undefined,
      externalPrescriptionDate:dto.externalPrescriptionDate??old.externalPrescriptionDate?.toISOString(),
      dose:dto.dose??old.dose??undefined,doseUnit:dto.doseUnit??old.doseUnit??undefined,
      frequency:dto.frequency??old.frequency??undefined,
      instructions:dto.instructions??old.instructions??undefined,
      notes:dto.notes??old.notes??undefined,
      startDate:dto.startDate??old.startDate?.toISOString(),
      endDate:dto.endDate??old.endDate?.toISOString(),
      scheduledTimes:dto.scheduledTimes??old.scheduledTimes,
      daysOfWeek:dto.daysOfWeek??old.daysOfWeek,
    });
    await this.authorize(old.patientId,'reminders');
    const actor=this.access.actor();
    if(actor.role.toUpperCase()==='DOCTOR')throw new ForbiddenException();
    return this.prisma.$transaction(async tx=>{
      const changed=await tx.patientTreatment.update({where:{id},data:{
        status:dto.status, externalPrescriberName:dto.externalPrescriberName,
        externalPrescriptionDate:dto.externalPrescriptionDate?new Date(dto.externalPrescriptionDate):undefined,
        dose:dto.dose,doseUnit:dto.doseUnit,frequency:dto.frequency,
        instructions:dto.instructions,notes:dto.notes,
        startDate:dto.startDate?new Date(dto.startDate):undefined,
        endDate:dto.endDate?new Date(dto.endDate):undefined,
        scheduledTimes:dto.scheduledTimes,daysOfWeek:dto.daysOfWeek
      },include:{medication:true}});
      await tx.auditLog.create({data:{userId:actor.id,module:'patient-treatments',action:'UPDATE',entityName:'PatientTreatment',
        entityId:id,description:JSON.stringify({previousStatus:old.status,status:changed.status})}});
      return changed;
    });
  }
  async record(id:number,dto:RecordTreatmentIntakeDto) {
    const item=await this.get(id);
    await this.authorize(item.patientId,'track');
    if(item.status!=='ACTIVE')throw new BadRequestException('El tratamiento no está activo.');
    const now=new Date();
    const takenAt=dto.status===TreatmentIntakeStatus.TAKEN?(dto.takenAt?new Date(dto.takenAt):now):null;
    if(takenAt && (takenAt.getTime()>now.getTime()||!Number.isFinite(takenAt.getTime())))
      throw new BadRequestException('La hora de toma es inválida.');
    if(dto.status===TreatmentIntakeStatus.SKIPPED&&dto.takenAt)
      throw new BadRequestException('Una toma omitida no tiene hora de administración.');
    const scheduledAt=dto.scheduledAt?new Date(dto.scheduledAt):null;
    if(scheduledAt && (!Number.isFinite(scheduledAt.getTime()) || scheduledAt>now))
      throw new BadRequestException('No se pueden confirmar horarios futuros o inválidos.');
    return this.prisma.$transaction(async tx=>{
      const row=await tx.patientTreatmentIntake.create({data:{
        patientTreatmentId:id,recordedByUserId:this.access.actor().id,status:dto.status,
        scheduledAt,takenAt,notes:dto.notes,
      }});
      await tx.auditLog.create({data:{userId:this.access.actor().id,module:'patient-treatments',action:'INTAKE',
        entityName:'PatientTreatmentIntake',entityId:row.id,description:JSON.stringify({treatmentId:id,status:row.status})}});
      return row;
    });
  }
  async history(id:number) {const item=await this.get(id);await this.authorize(item.patientId);return this.prisma.patientTreatmentIntake.findMany({
    where:{patientTreatmentId:id},orderBy:{createdAt:'desc'},take:100
  });}
}
