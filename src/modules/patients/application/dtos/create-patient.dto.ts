import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  PATIENT_GENDERS,
  PatientGender,
} from '../../domain/entities/patient.entity';

// Entrada validada para crear la ficha clinica basica de un paciente.
export class CreatePatientDto {
  @IsInt()
  @Min(1)
  userId!: number;

  @IsString()
  fullName!: string;

  @IsDateString()
  birthDate!: string;

  @IsOptional()
  @IsEnum(PATIENT_GENDERS)
  gender?: PatientGender;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;
}
