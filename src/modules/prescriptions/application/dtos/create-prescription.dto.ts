import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePrescriptionItemDto {
  @ApiProperty({ description: 'ID del medicamento a prescribir', example: 1 })
  @IsInt()
  @IsNotEmpty()
  medicationId!: number;

  @ApiProperty({ description: 'Dosis prescrita', example: '500 mg' })
  @IsString()
  @IsNotEmpty()
  dose!: string;

  @ApiProperty({ description: 'Frecuencia de administración', example: 'Cada 8 horas' })
  @IsString()
  @IsNotEmpty()
  frequency!: string;

  @ApiProperty({ description: 'Duración del tratamiento', example: '7 días' })
  @IsString()
  @IsNotEmpty()
  duration!: string;

  @ApiPropertyOptional({ description: 'Instrucciones específicas de consumo', example: 'Tomar después de los alimentos' })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio del tratamiento', example: '2026-08-20T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Fecha de término del tratamiento', example: '2026-08-27T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class CreatePrescriptionDto {
  @ApiProperty({ description: 'ID del paciente asignado a la receta', example: 1 })
  @IsInt()
  @IsNotEmpty()
  patientId!: number;

  @ApiProperty({ description: 'Diagnóstico médico asociado', example: 'Infección respiratoria aguda' })
  @IsString()
  @IsNotEmpty()
  diagnosis!: string;

  @ApiPropertyOptional({ description: 'Instrucciones generales de cuidado', example: 'Guardar reposo' })
  @IsString()
  @IsOptional()
  generalInstructions?: string;

  @ApiPropertyOptional({ description: 'Fecha de emisión de la receta', example: '2026-08-20T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  issueDate?: string;

  @ApiPropertyOptional({ description: 'Fecha de expiración de la receta', example: '2026-08-30T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  expirationDate?: string;

  @ApiProperty({ description: 'Listado de medicamentos recetados', type: [CreatePrescriptionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionItemDto)
  items!: CreatePrescriptionItemDto[];
}