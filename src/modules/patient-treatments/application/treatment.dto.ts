import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, ArrayMaxSize, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsNotEmpty, MaxLength, Min } from 'class-validator';
import { TreatmentOrigin, TreatmentStatus, TreatmentIntakeStatus } from '../../../../generated/prisma/client';

export class CreatePatientTreatmentDto {
  @ApiProperty() @IsInt() @Min(1) patientId!: number;
  @ApiProperty() @IsInt() @Min(1) medicationId!: number;
  @ApiProperty({ enum: TreatmentOrigin }) @IsEnum(TreatmentOrigin) origin!: TreatmentOrigin;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(120) externalPrescriberName?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() externalPrescriptionDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) dose?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50) doseUnit?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) frequency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(1000) instructions?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(1000) notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @ArrayMaxSize(24) @IsString({each:true}) scheduledTimes?: string[];
  @ApiPropertyOptional({ type: [Number] }) @IsOptional() @IsArray() @ArrayMaxSize(7) @IsInt({each:true}) daysOfWeek?: number[];
}
export class UpdatePatientTreatmentDto extends PartialType(CreatePatientTreatmentDto) {
  @ApiPropertyOptional({ enum: TreatmentStatus }) @IsOptional() @IsEnum(TreatmentStatus) status?: TreatmentStatus;
}
export class RecordTreatmentIntakeDto {
  @ApiProperty({enum:TreatmentIntakeStatus}) @IsEnum(TreatmentIntakeStatus) status!: TreatmentIntakeStatus;
  @ApiPropertyOptional() @IsOptional() @IsDateString() scheduledAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() takenAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255) notes?: string;
}
