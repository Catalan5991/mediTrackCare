import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PatientAccessService } from '../../../common/authorization/patient-access.service';
import { CreatePatientTreatmentDto, UpdatePatientTreatmentDto, RecordTreatmentIntakeDto } from '../application/treatment.dto';
import { localDate, localInstant, addDays } from '../../prescriptions/domain/schedule';
import { AdministrationKind, MedicationForm, MedicationRoute } from '../../../../generated/prisma/client';
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

  async createAdministration(input:{
    patientId:number;kind:AdministrationKind;label:string;origin?:TreatmentOrigin;
    instructions?:string;notes?:string;startDate:string;endDate?:string;
    scheduledTimes:string[];daysOfWeek?:number[];
    components:{medicationId:number;dose:string;doseUnit:string;instructions?:string}[];
  }) {
    if(this.access.actor().role.toUpperCase()==='DOCTOR')throw new ForbiddenException('Este registro no emite una receta clínica verificada.');
    await this.authorize(input.patientId,'reminders');
    if(!Object.values(AdministrationKind).includes(input.kind)||!input.label?.trim()||input.label.length>120||
      !/^\\d{4}-\\d{2}-\\d{2}$/.test(input.startDate)||!Number.isFinite(Date.parse(input.startDate))||
      (input.endDate&&(!/^\\d{4}-\\d{2}-\\d{2}$/.test(input.endDate)||input.endDate<input.startDate))||
      !Array.isArray(input.scheduledTimes)||!input.scheduledTimes.length||input.scheduledTimes.length>24||
      new Set(input.scheduledTimes).size!==input.scheduledTimes.length||
      input.scheduledTimes.some(t=>!/^([01]\\d|2[0-3]):[0-5]\\d$/.test(t))||
      (input.daysOfWeek??[]).some(d=>!Number.isInteger(d)||d<0||d>6)||
      !Array.isArray(input.components)||!input.components.length||input.components.length>10||
      input.components.some(c=>!Number.isSafeInteger(c.medicationId)||c.medicationId<1||
        !c.dose?.trim()||!c.doseUnit?.trim()||c.dose.length>100||c.doseUnit.length>50))
      throw new BadRequestException('Revisa componentes, dosis y programación de la sesión.');
    return this.prisma.$transaction(async tx=>{
      await this.access.assert(input.patientId,'reminders',tx);
      const patient=await tx.patient.findFirst({where:{id:input.patientId,isActive:true}});
      if(!patient)throw new BadRequestException('Paciente no disponible.');
      const ids=[...new Set(input.components.map(c=>c.medicationId))];
      const available=await tx.medication.count({where:{id:{in:ids},isActive:true,OR:[{ownerPatientId:null},{ownerPatientId:input.patientId}]}});
      if(available!==ids.length)throw new BadRequestException('Uno o más medicamentos no pertenecen a este paciente.');
      const session=await tx.administrationSession.create({data:{
        patientId:input.patientId,createdByUserId:this.access.actor().id,kind:input.kind,
        label:input.label.trim(),origin:input.origin??TreatmentOrigin.SELF_REPORTED,
        instructions:input.instructions,notes:input.notes,startDate:new Date(input.startDate),
        endDate:input.endDate?new Date(input.endDate):undefined,scheduledTimes:input.scheduledTimes,
        daysOfWeek:input.daysOfWeek??[],timeZone:patient.timeZone,
        components:{create:input.components.map(c=>({medicationId:c.medicationId,dose:c.dose,doseUnit:c.doseUnit,instructions:c.instructions}))}
      },include:{components:{include:{medication:true}}}});
      await tx.auditLog.create({data:{userId:this.access.actor().id,module:'patient-treatments',action:'CREATE',
        entityName:'AdministrationSession',entityId:session.id,description:JSON.stringify({patientId:input.patientId,kind:input.kind})}});
      return session;
    });
  }
  async listAdministrations(patientId:number) {
    await this.authorize(patientId);
    return this.prisma.administrationSession.findMany({where:{patientId},include:{components:{include:{medication:true}}},orderBy:{createdAt:'desc'},take:100});
  }
  async recordAdministration(id:number,input:{scheduledAt:string;status:TreatmentIntakeStatus;notes?:string}) {
    const session=await this.prisma.administrationSession.findUnique({where:{id}});
    if(!session)throw new NotFoundException('Sesión no encontrada.');
    await this.authorize(session.patientId,'track');
    if(!session.isActive||!['TAKEN','SKIPPED'].includes(input.status)||!input.scheduledAt)
      throw new BadRequestException('Sesión o estado no válido.');
    const at=new Date(input.scheduledAt),now=new Date();
    if(!Number.isFinite(at.getTime())||at>now)throw new BadRequestException('No se admiten horarios futuros.');
    const day=localDate(at,session.timeZone);
    const weekdays=new Date(day+'T00:00:00Z').getUTCDay();
    const valid=day>=session.startDate.toISOString().slice(0,10)&&
      (!session.endDate||day<=session.endDate.toISOString().slice(0,10))&&
      (!session.daysOfWeek.length||session.daysOfWeek.includes(weekdays))&&
      session.scheduledTimes.some(t=>localInstant(day,t,session.timeZone)?.getTime()===at.getTime());
    if(!valid)throw new BadRequestException('Horario no programado en esta sesión.');
    return this.prisma.administrationSessionIntake.create({data:{
      sessionId:id,scheduledAt:at,status:input.status,recordedByUserId:this.access.actor().id,
      takenAt:input.status==='TAKEN'?now:null,notes:input.notes
    }});
  }

  async customMedications(patientId:number,search='') {
    await this.authorize(patientId);
    return this.prisma.medication.findMany({where:{ownerPatientId:patientId,isActive:true,
      name:{contains:search.trim(),mode:'insensitive'}},orderBy:{name:'asc'},take:50});
  }
  async createCustomMedication(patientId:number,input:{name:string;presentation:MedicationForm;route:MedicationRoute;concentration?:string;unit?:string}) {
    await this.authorize(patientId,'reminders');
    if(this.access.actor().role.toUpperCase()==='DOCTOR')throw new ForbiddenException();
    const name=input.name?.trim();
    if(!name||name.length<2||name.length>100||!Object.values(MedicationForm).includes(input.presentation)||
      !Object.values(MedicationRoute).includes(input.route)||(input.concentration?.length ?? 0)>80||(input.unit?.length ?? 0)>50)
      throw new BadRequestException('Completa los datos del medicamento.');
    return this.prisma.$transaction(async tx=>{
      await this.access.assert(patientId,'reminders',tx);
      const existing=await tx.medication.findFirst({where:{ownerPatientId:patientId,
        name:{equals:name,mode:'insensitive'},presentation:input.presentation,concentration:input.concentration||null,
        route:input.route,isActive:true}});
      if(existing)return existing;
      const created=await tx.medication.create({data:{ownerPatientId:patientId,name,presentation:input.presentation,
        route:input.route,concentration:input.concentration?.trim()||null,unit:input.unit?.trim()||null}});
      await tx.auditLog.create({data:{userId:this.access.actor().id,module:'medications',action:'CREATE',
        entityName:'Medication',entityId:created.id,description:JSON.stringify({patientId,scope:'PRIVATE'})}});
      return created;
    });
  }
  async create(dto:CreatePatientTreatmentDto) {
    this.verify(dto);
    // Only owners or explicitly authorized caregivers can add personal/external treatment records.
    if(this.access.actor().role.toUpperCase()==='DOCTOR')
      throw new ForbiddenException('Utiliza el servicio de prescripciones clínicas para médicos.');
    await this.authorize(dto.patientId,'reminders');
    return this.prisma.$transaction(async tx=>{
      const patient=await tx.patient.findUnique({where:{id:dto.patientId}});
      const medication=await tx.medication.findFirst({where:{id:dto.medicationId,isActive:true,OR:[{ownerPatientId:null},{ownerPatientId:dto.patientId}]}});
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

  async createConsultation(input: {
    patientId:number; visitDate:string; doctorName:string; specialty?:string; clinic?:string;
    nextVisitDate?:string; notes?:string; medications: Array<{
      medicationId:number;dose:string;doseUnit?:string;frequency:string;startDate:string;endDate?:string;
      scheduledTimes:string[];daysOfWeek?:number[];instructions?:string;
    }>;
  }) {
    if(this.access.actor().role.toUpperCase()==='DOCTOR')
      throw new ForbiddenException('Este flujo es para transcribir recetas externas, no emitir prescripciones verificadas.');
    await this.authorize(input.patientId,'reminders');
    const validDate=(s:string)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
    if(!validDate(input.visitDate)||!input.doctorName?.trim()||input.doctorName.length>120||
       input.nextVisitDate&&!validDate(input.nextVisitDate)||input.notes&&input.notes.length>1000||
       input.clinic&&input.clinic.length>120||input.specialty&&input.specialty.length>120)
      throw new BadRequestException('Revisa los datos de la consulta y sus fechas.');
    if(!Array.isArray(input.medications)||!input.medications.length||input.medications.length>30)
      throw new BadRequestException('La receta necesita entre 1 y 30 medicamentos.');
    for(const m of input.medications) {
      if(!m.dose?.trim()||!m.frequency?.trim()||!validDate(m.startDate)||
         m.endDate&&(!validDate(m.endDate)||m.endDate<m.startDate)||
         !Number.isSafeInteger(m.medicationId)||m.medicationId<1||
         !Array.isArray(m.scheduledTimes)||!m.scheduledTimes.length||
         m.scheduledTimes.length>24||new Set(m.scheduledTimes).size!==m.scheduledTimes.length||
         m.scheduledTimes.some(t=>!/^([01]\d|2[0-3]):[0-5]\d$/.test(t))||
         (m.daysOfWeek??[]).some(d=>!Number.isInteger(d)||d<0||d>6))
        throw new BadRequestException('Revisa dosis, frecuencia, fecha de inicio y horarios de todos los medicamentos.');
    }
    const actor=this.access.actor();
    return this.prisma.$transaction(async tx=>{
      await this.access.assert(input.patientId,'reminders',tx);
      const patient=await tx.patient.findFirst({where:{id:input.patientId,isActive:true}});
      if(!patient)throw new BadRequestException('Paciente no disponible.');
      const ids=[...new Set(input.medications.map(m=>m.medicationId))];
      const catalog=await tx.medication.findMany({where:{id:{in:ids},isActive:true,OR:[{ownerPatientId:null},{ownerPatientId:input.patientId}]},select:{id:true}});
      if(catalog.length!==ids.length)throw new BadRequestException('Hay medicamentos inexistentes o inactivos.');
      const consultation=await tx.externalConsultation.create({data:{
        patientId:input.patientId,registeredByUserId:actor.id,visitDate:new Date(input.visitDate),
        doctorName:input.doctorName.trim(),specialty:input.specialty?.trim(),clinic:input.clinic?.trim(),
        nextVisitDate:input.nextVisitDate?new Date(input.nextVisitDate):undefined,notes:input.notes?.trim()
      }});
      const treatmentIds:number[]=[];
      for(const med of input.medications) {
        const createdTreatment=await tx.patientTreatment.create({data:{
          patientId:input.patientId,registeredByUserId:actor.id,consultationId:consultation.id,
          medicationId:med.medicationId,origin:'EXTERNAL_PRESCRIPTION',
          externalPrescriberName:input.doctorName.trim(),externalPrescriptionDate:new Date(input.visitDate),
          dose:med.dose.trim(),doseUnit:med.doseUnit,frequency:med.frequency.trim(),
          startDate:new Date(med.startDate),endDate:med.endDate?new Date(med.endDate):undefined,
          scheduledTimes:med.scheduledTimes,daysOfWeek:med.daysOfWeek??[],instructions:med.instructions,
          timeZone:patient.timeZone
        }});
        treatmentIds.push(createdTreatment.id);
      }
      await tx.auditLog.create({data:{userId:actor.id,module:'patient-treatments',action:'CREATE',
        entityName:'ExternalConsultation',entityId:consultation.id,description:JSON.stringify({patientId:input.patientId,treatments:treatmentIds.length})}});
      return {consultationId:consultation.id,treatmentIds,count:treatmentIds.length};
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

  private slots(t: {startDate:Date|null;endDate:Date|null;scheduledTimes:string[];daysOfWeek:number[];timeZone:string}, date:string) {
    const start=t.startDate?.toISOString().slice(0,10), end=t.endDate?.toISOString().slice(0,10);
    if(!start || date<start || (end && date>end))return [];
    const weekday=new Date(date+'T00:00:00Z').getUTCDay();
    if(t.daysOfWeek.length && !t.daysOfWeek.includes(weekday))return [];
    return t.scheduledTimes.map(time=>localInstant(date,time,t.timeZone)).filter((d):d is Date=>!!d).sort((a,b)=>a.getTime()-b.getTime());
  }
  async agenda(patientId:number,date:string) {
    await this.authorize(patientId);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date+'T00:00:00Z')) ||
       new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date) throw new BadRequestException('Fecha inválida.');
    const treatments=await this.prisma.patientTreatment.findMany({where:{patientId},include:{medication:true,intakes:true}});
    const now=new Date();
    const data=treatments.flatMap(t => this.slots(t,date).map(at=>{
      const found=t.intakes.find(row=>row.scheduledAt?.getTime()===at.getTime());
      const future=[...this.slots(t,date),...this.slots(t,addDays(date,1))].find(next=>next>at);
      const status=found?.status==='TAKEN'?'TOMADA':found?.status==='SKIPPED'?'OMITIDA':
        t.status!=='ACTIVE'?'CANCELADA':future&&future<=now?'VENCIDA_SIN_CONFIRMAR':at<=now?'RETRASADA':'PENDIENTE';
      return {treatmentId:t.id,occurrenceKey:'personal:'+t.id+':'+at.toISOString(),scheduledAt:at,
        medication:t.medication,dose:t.dose,frequency:t.frequency,status,takenAt:found?.takenAt??null,origin:t.origin};
    })).sort((a,b)=>a.scheduledAt.getTime()-b.scheduledAt.getTime());
    return {patientId,date,data,total:data.length};
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
    if(!dto.scheduledAt)throw new BadRequestException('Selecciona un horario programado.');
    const scheduledAt=new Date(dto.scheduledAt);
    if(scheduledAt && (!Number.isFinite(scheduledAt.getTime()) || scheduledAt>now))
      throw new BadRequestException('No se pueden confirmar horarios futuros o inválidos.');
    const day=localDate(scheduledAt,item.timeZone);
    if(!this.slots(item,day).some(at=>at.getTime()===scheduledAt.getTime()))
      throw new BadRequestException('La toma no corresponde a un horario programado.');
    const following=[...this.slots(item,day),...this.slots(item,addDays(day,1))].find(at=>at>scheduledAt);
    if(dto.status===TreatmentIntakeStatus.TAKEN && following && following<=now)throw new BadRequestException('Esta toma venció sin confirmación al comenzar el siguiente horario. No se pueden confirmar ambas.');
    return this.prisma.$transaction(async tx=>{
      // El bloqueo devuelve void: ejecutar sin deserializar resultados, con claves INT4 explícitas.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(880::integer, ${id}::integer)`;
      const existing=await tx.patientTreatmentIntake.findFirst({where:{patientTreatmentId:id,scheduledAt}});
      if(existing)throw new BadRequestException('Esta toma ya se registró.');
      const row=await tx.patientTreatmentIntake.create({data:{
        patientTreatmentId:id,recordedByUserId:this.access.actor().id,status:dto.status,
        scheduledAt,takenAt,notes:dto.notes,
      }});
      await tx.notification.updateMany({where:{deduplicationKey:{startsWith:'personal:'+id+':'+scheduledAt.toISOString()+':'},status:'PENDIENTE'},data:{cancelledAt:new Date()}});
      await tx.auditLog.create({data:{userId:this.access.actor().id,module:'patient-treatments',action:'INTAKE',
        entityName:'PatientTreatmentIntake',entityId:row.id,description:JSON.stringify({treatmentId:id,status:row.status})}});
      return row;
    });
  }
  async history(id:number) {const item=await this.get(id);await this.authorize(item.patientId);return this.prisma.patientTreatmentIntake.findMany({
    where:{patientTreatmentId:id},orderBy:{createdAt:'desc'},take:100
  });}
}
