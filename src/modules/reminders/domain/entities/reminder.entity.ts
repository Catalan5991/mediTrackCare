import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Representa un recordatorio de medicamento persistido dentro del dominio.
export class ReminderEntity {
  @ApiProperty({
    example: 1,
    description: 'Identificador unico del recordatorio.',
  })
  id!: number;

  @ApiProperty({
    example: 1,
    description: 'ID del paciente relacionado con el recordatorio.',
  })
  patientId!: number;

  @ApiProperty({
    example: 3,
    description: 'ID del item de receta relacionado con el recordatorio.',
  })
  prescriptionItemId!: number;

  @ApiProperty({
    example: '08:00',
    description: 'Hora programada para el recordatorio en formato HH:mm.',
  })
  scheduledTime!: string;

  @ApiPropertyOptional({
    example: 'MON,TUE,WED,THU,FRI',
    description: 'Dias de la semana en los que aplica el recordatorio.',
  })
  daysOfWeek?: string | null;

  @ApiProperty({
    example: true,
    description: 'Indica si el recordatorio esta activo.',
  })
  isActive!: boolean;

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

  constructor(partial: Partial<ReminderEntity>) {
    Object.assign(this, partial);
  }
}
