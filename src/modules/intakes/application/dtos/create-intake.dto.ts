import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { IntakeStatus } from '../../../../../generated/prisma/client';

// Define y valida los datos requeridos para registrar una toma.
export class CreateIntakeDto {
  @ApiProperty({
    example: 1,
    description: 'ID del paciente al que pertenece la toma.',
  })
  @IsInt()
  @Min(1)
  patientId!: number;

  @ApiProperty({
    example: 3,
    description: 'ID del item de receta asociado a la toma.',
  })
  @IsInt()
  @Min(1)
  prescriptionItemId!: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'ID del recordatorio asociado a la toma, si aplica.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  reminderId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID del usuario que confirmo la toma.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  confirmedByUserId?: number;

  @ApiProperty({
    example: '2026-07-06T08:00:00.000Z',
    description: 'Fecha y hora programada para la toma.',
  })
  @IsDateString()
  scheduledAt!: string;

  @ApiPropertyOptional({
    example: '2026-07-06T08:05:00.000Z',
    description: 'Fecha y hora real en que se tomo el medicamento.',
  })
  @IsOptional()
  @IsDateString()
  takenAt?: string;

  @ApiPropertyOptional({
    enum: IntakeStatus,
    enumName: 'IntakeStatus',
    example: IntakeStatus.PENDIENTE,
    description: 'Estado de la toma.',
  })
  @IsOptional()
  @IsEnum(IntakeStatus)
  status?: IntakeStatus;

  @ApiPropertyOptional({
    example: 'Tomada con alimentos.',
    description: 'Notas adicionales sobre la toma.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  notes?: string;
}
