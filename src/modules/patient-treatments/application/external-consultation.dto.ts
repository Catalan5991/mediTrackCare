import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsInt, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';

export class ExternalConsultationMedicationDto {
  @ApiProperty() @IsInt() @Min(1) medicationId!:number;
  @ApiProperty() @IsString() @MaxLength(100) dose!:string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50) doseUnit?:string;
  @ApiProperty() @IsString() @MaxLength(100) frequency!:string;
  @ApiProperty() @IsDateString() startDate!:string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?:string;
  @ApiProperty({type:[String]}) @IsArray() @ArrayMinSize(1) @ArrayMaxSize(24) @IsString({each:true}) scheduledTimes!:string[];
  @ApiPropertyOptional({type:[Number]}) @IsOptional() @IsArray() @ArrayMaxSize(7) @IsInt({each:true}) daysOfWeek?:number[];
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(1000) instructions?:string;
}
export class CreateExternalConsultationDto {
  @ApiProperty() @IsInt() @Min(1) patientId!:number;
  @ApiProperty() @IsDateString() visitDate!:string;
  @ApiProperty() @IsString() @MaxLength(120) doctorName!:string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(120) specialty?:string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(120) clinic?:string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() nextVisitDate?:string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(1000) notes?:string;
  @ApiProperty({type:[ExternalConsultationMedicationDto]}) @IsArray() @ArrayMinSize(1) @ArrayMaxSize(30)
  @ValidateNested({each:true}) @Type(()=>ExternalConsultationMedicationDto) medications!:ExternalConsultationMedicationDto[];
}
