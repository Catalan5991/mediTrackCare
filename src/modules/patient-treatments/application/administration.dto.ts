import { Type } from 'class-transformer';
import { IsArray, ArrayMinSize, ArrayMaxSize, IsDateString, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { AdministrationKind, TreatmentIntakeStatus, TreatmentOrigin } from '../../../../generated/prisma/client';
export class AdministrationComponentDto {
 @IsInt() @Min(1) medicationId!:number;
 @IsString() @MaxLength(100) dose!:string;
 @IsString() @MaxLength(50) doseUnit!:string;
 @IsOptional() @IsString() @MaxLength(1000) instructions?:string;
}
export class CreateAdministrationDto {
 @IsInt() @Min(1) patientId!:number;
 @IsEnum(AdministrationKind) kind!:AdministrationKind;
 @IsString() @MaxLength(120) label!:string;
 @IsOptional() @IsEnum(TreatmentOrigin) origin?:TreatmentOrigin;
 @IsOptional() @IsString() @MaxLength(1000) instructions?:string;
 @IsOptional() @IsString() @MaxLength(1000) notes?:string;
 @IsDateString() startDate!:string;
 @IsOptional() @IsDateString() endDate?:string;
 @IsArray() @ArrayMinSize(1) @ArrayMaxSize(24) @IsString({each:true}) scheduledTimes!:string[];
 @IsOptional() @IsArray() @ArrayMaxSize(7) @IsInt({each:true}) daysOfWeek?:number[];
 @IsArray() @ArrayMinSize(1) @ArrayMaxSize(10) @ValidateNested({each:true}) @Type(()=>AdministrationComponentDto) components!:AdministrationComponentDto[];
}
export class RecordAdministrationDto {
 @IsDateString() scheduledAt!:string;
 @IsEnum(TreatmentIntakeStatus) status!:TreatmentIntakeStatus;
 @IsOptional() @IsString() @MaxLength(255) notes?:string;
}
