import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
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

// Entrada parcial para modificar datos del paciente o cambiar su estado.
export class UpdatePatientDto {
  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    description: 'Id del usuario asociado al paciente.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiPropertyOptional({
    example: 'Maria Lopez',
    description: 'Nombre completo del paciente.',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    example: '1990-05-20',
    description: 'Fecha de nacimiento en formato ISO.',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    enum: PATIENT_GENDERS,
    example: PATIENT_GENDERS.FEMENINO,
  })
  @IsOptional()
  @IsEnum(PATIENT_GENDERS)
  gender?: PatientGender;

  @ApiPropertyOptional({ example: '+5215512345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Av. Reforma 123, Ciudad de Mexico' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Juan Lopez' })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({ example: '+5215598765432' })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Estado activo del paciente.',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
