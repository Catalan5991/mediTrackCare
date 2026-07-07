import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IntakeStatus } from '../../../../../generated/prisma/client';

// Representa una toma de medicamento persistida dentro del dominio.
export class IntakeEntity {
  @ApiProperty({
    example: 1,
    description: 'Identificador unico de la toma.',
  })
  id!: number;

  @ApiProperty({
    example: 1,
    description: 'ID del paciente relacionado con la toma.',
  })
  patientId!: number;

  @ApiProperty({
    example: 3,
    description: 'ID del item de receta relacionado con la toma.',
  })
  prescriptionItemId!: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'ID del recordatorio que genero la toma, si aplica.',
  })
  reminderId?: number | null;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID del usuario que confirmo la toma.',
  })
  confirmedByUserId?: number | null;

  @ApiProperty({
    example: '2026-07-06T08:00:00.000Z',
    description: 'Fecha y hora programada para la toma.',
  })
  scheduledAt!: Date;

  @ApiPropertyOptional({
    example: '2026-07-06T08:05:00.000Z',
    description: 'Fecha y hora real en que se tomo el medicamento.',
  })
  takenAt?: Date | null;

  @ApiProperty({
    enum: IntakeStatus,
    enumName: 'IntakeStatus',
    example: IntakeStatus.PENDIENTE,
    description: 'Estado actual de la toma.',
  })
  status!: IntakeStatus;

  @ApiPropertyOptional({
    example: 'Tomada con alimentos.',
    description: 'Notas adicionales sobre la toma.',
  })
  notes?: string | null;

  @ApiProperty({
    example: '2026-07-06T08:00:00.000Z',
    description: 'Fecha de creacion del registro.',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-07-06T08:00:00.000Z',
    description: 'Fecha de ultima actualizacion del registro.',
  })
  updatedAt!: Date;

  constructor(partial: Partial<IntakeEntity>) {
    Object.assign(this, partial);
  }
}
