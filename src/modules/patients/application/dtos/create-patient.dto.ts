import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'Id del usuario asociado al paciente.',
  })
  @IsInt()
  @Min(1)
  userId!: number;

  @ApiProperty({
    example: 'Maria Lopez',
    description: 'Nombre completo del paciente.',
  })
  @IsString()
  fullName!: string;

  @ApiProperty({
    example: '1990-05-20',
    description: 'Fecha de nacimiento en formato ISO.',
  })
  @IsDateString()
  birthDate!: string;

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
}
