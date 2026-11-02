import { BadRequestException, Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength, MinLength, validateOrReject } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
class PersonalDto {
 @IsOptional() @IsString() @MinLength(2) @MaxLength(120) name?:string;
 @IsOptional() @IsString() @MaxLength(30) phone?:string;
}
class MedicalDto {
 @IsOptional() @IsIn(['A+','A-','B+','B-','AB+','AB-','O+','O-','UNKNOWN']) bloodType?:string|null;
 @IsOptional() @IsString() @MaxLength(2000) allergies?:string|null;
 @IsOptional() @IsString() @MaxLength(2000) conditions?:string|null;
 @IsOptional() @IsString() @MaxLength(2000) medicalNotes?:string|null;
}
@ApiTags('Self profile') @ApiBearerAuth() @Controller('self-profile')
export class SelfProfileController {
 constructor(private readonly prisma:PrismaService){}
 @Get()
 async get(@Req() req:{user:{id:number}}){
  const u=await this.prisma.user.findUnique({where:{id:req.user.id},select:{
   id:true,name:true,email:true,phone:true,
   patientProfile:{select:{id:true,medicalProfile:true}}
  }});
  if(!u)throw new BadRequestException('Usuario no encontrado');
  return u;
 }
 @Patch('personal')
 async personal(@Req() req:{user:{id:number}},@Body() dto:PersonalDto){
  await validateOrReject(Object.assign(new PersonalDto(),dto)).catch(()=>{throw new BadRequestException('Datos personales inválidos');});
  const {name,phone}=dto;
  if(name===undefined&&phone===undefined)throw new BadRequestException('Sin cambios');
  return this.prisma.$transaction(async tx=>{
   const u=await tx.user.update({where:{id:req.user.id},data:{name:name?.trim(),phone:phone?.trim()},select:{id:true,name:true,email:true,phone:true}});
   if(name!==undefined)await tx.patient.updateMany({where:{userId:req.user.id},data:{fullName:name.trim()}});
   return u;
  });
 }
 @Patch('medical')
 async medical(@Req() req:{user:{id:number}},@Body() dto:MedicalDto){
  await validateOrReject(Object.assign(new MedicalDto(),dto)).catch(()=>{throw new BadRequestException('Datos médicos inválidos');});
  const patient=await this.prisma.patient.findUnique({where:{userId:req.user.id},select:{id:true}});
  if(!patient)throw new BadRequestException('Solo los pacientes pueden registrar estos antecedentes en su perfil');
  const data={bloodType:dto.bloodType??null,allergies:dto.allergies?.trim()??null,conditions:dto.conditions?.trim()??null,medicalNotes:dto.medicalNotes?.trim()??null};
  return this.prisma.patientMedicalProfile.upsert({where:{patientId:patient.id},create:{patientId:patient.id,...data},update:data});
 }
}
