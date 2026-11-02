import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Post, ConflictException, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsIn, IsString, Matches, validateOrReject } from 'class-validator';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../../../prisma/prisma.service';
import { PatientAccessService } from '../../../../common/authorization/patient-access.service';

class CreateInvitationDto {
 @IsIn(['CAREGIVER','DOCTOR']) kind!: 'CAREGIVER'|'DOCTOR';
}
class RedeemInvitationDto {
 @IsString() @Matches(/^[A-F0-9]{12}$/) code!: string;
}
@ApiTags('Patient link invitations') @ApiBearerAuth() @Controller('patient-link-invitations')
export class PatientLinkInvitationsController {
 constructor(private readonly prisma:PrismaService,private readonly access:PatientAccessService){}
 private hash(value:string){return createHash('sha256').update(value).digest('hex');}
 private async ownedPatient(){
   const actor=this.access.actor();
   if(actor.role.toUpperCase()!=='PATIENT')throw new ForbiddenException('Solo el paciente puede generar invitaciones.');
   const patient=await this.prisma.patient.findUnique({where:{userId:actor.id},select:{id:true,isActive:true}});
   if(!patient?.isActive)throw new ForbiddenException('No hay perfil de paciente activo.');
   return patient.id;
 }
 @Post()
 async create(@Body() input:CreateInvitationDto){
   await validateOrReject(Object.assign(new CreateInvitationDto(),input)).catch(()=>{throw new BadRequestException('Tipo de invitación inválido.');});
   const patientId=await this.ownedPatient();
   const open=await this.prisma.patientLinkInvitation.count({where:{patientId,claimedAt:null,expiresAt:{gt:new Date()}}});
   if(open>=5)throw new ConflictException('Ya tienes cinco invitaciones vigentes. Cancela una o espera a que caduque.');
   const code=randomBytes(6).toString('hex').toUpperCase();
   const expiresAt=new Date(Date.now()+10*60*1000);
   const item=await this.prisma.patientLinkInvitation.create({data:{patientId,kind:input.kind,tokenHash:this.hash(code),expiresAt}});
   return {id:item.id,kind:item.kind,code,expiresAt:item.expiresAt};
 }
 @Get()
 async list(){
   const patientId=await this.ownedPatient();
   return this.prisma.patientLinkInvitation.findMany({where:{patientId,claimedAt:null,expiresAt:{gt:new Date()}},select:{id:true,kind:true,expiresAt:true,createdAt:true},orderBy:{createdAt:'desc'},take:5});
 }
 @Delete(':id')
 async cancel(@Param('id',ParseIntPipe) id:number){
   const patientId=await this.ownedPatient();
   const deleted=await this.prisma.patientLinkInvitation.deleteMany({where:{id,patientId,claimedAt:null}});
   if(!deleted.count)throw new NotFoundException('Invitación no disponible.');
   return {cancelled:true};
 }
 @Post('redeem')
 async redeem(@Body() input:RedeemInvitationDto){
   await validateOrReject(Object.assign(new RedeemInvitationDto(),input)).catch(()=>{throw new BadRequestException('Código inválido.');});
   const actor=this.access.actor();
   if(!['CAREGIVER','DOCTOR'].includes(actor.role.toUpperCase()))throw new ForbiddenException('Solo familiares, cuidadores y médicos pueden canjear invitaciones.');
   return this.prisma.$transaction(async tx=>{
     const invitation=await tx.patientLinkInvitation.findUnique({where:{tokenHash:this.hash(input.code)},include:{patient:true}});
     if(!invitation||invitation.claimedAt||invitation.expiresAt<=new Date()||!invitation.patient.isActive)
       throw new BadRequestException('Código no válido o caducado.');
     if(invitation.kind!==actor.role.toUpperCase())throw new ForbiddenException('Esta invitación no corresponde a tu tipo de cuenta.');
     const claim=await tx.patientLinkInvitation.updateMany({where:{id:invitation.id,claimedAt:null,expiresAt:{gt:new Date()}},data:{claimedAt:new Date(),claimedByUserId:actor.id}});
     if(!claim.count)throw new ConflictException('Esta invitación ya fue utilizada.');
     const pending={status:'PENDING' as const,isActive:false,requestedAt:new Date(),acceptedAt:null,
       requestedByUserId:actor.id,canRead:false,canTrack:false,canManageReminders:false};
     if(invitation.kind==='CAREGIVER'){
       const existing=await tx.caregiver.findUnique({where:{userId_patientId:{userId:actor.id,patientId:invitation.patientId}}});
       if(existing&&['ACTIVE','PENDING'].includes(existing.status))throw new ConflictException('Ya tienes acceso o una solicitud pendiente.');
       await tx.caregiver.upsert({where:{userId_patientId:{userId:actor.id,patientId:invitation.patientId}},
         create:{userId:actor.id,patientId:invitation.patientId,relationship:'Familiar / cuidador',...pending},update:pending});
     }else{
       const doctor=await tx.doctor.findUnique({where:{userId:actor.id}});
       if(!doctor?.isActive||doctor.verificationStatus!=='VERIFIED')throw new ForbiddenException('El médico debe tener su perfil profesional verificado.');
       const existing=await tx.doctorPatient.findUnique({where:{doctorId_patientId:{doctorId:doctor.id,patientId:invitation.patientId}}});
       if(existing&&['ACTIVE','PENDING'].includes(existing.status))throw new ConflictException('Ya tienes acceso o una solicitud pendiente.');
       await tx.doctorPatient.upsert({where:{doctorId_patientId:{doctorId:doctor.id,patientId:invitation.patientId}},
         create:{doctorId:doctor.id,patientId:invitation.patientId,...pending},update:pending});
     }
     await tx.auditLog.create({data:{userId:actor.id,module:'patient-links',action:'REDEEM_INVITATION',
       entityName:invitation.kind,entityId:invitation.patientId,description:JSON.stringify({invitationId:invitation.id})}});
     return {status:'PENDING',message:'Solicitud creada. El paciente debe aprobar el acceso.'};
   },{isolationLevel:'Serializable'});
 }
}
