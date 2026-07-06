import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MeasurementType } from '../../../../../generated/prisma/client';

// Representa una medicion medica ya persistida dentro del dominio.
export class MedicalMeasurementEntity {
  @ApiProperty({
    example: 1,
    description: 'Identificador único de la medición médica.',
  })
  id!: number;

  @ApiProperty({
    example: 1,
    description: 'ID del paciente relacionado con la medición.',
  })
  patientId!: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID del usuario que registró la medición.',
  })
  registeredByUserId?: number | null;

  @ApiProperty({
    enum: MeasurementType,
    enumName: 'MeasurementType',
    example: 'GLUCOSE',
    description: 'Tipo de medición médica.',
  })
  measurementType!: MeasurementType;

  @ApiProperty({
    example: 120.5,
    description: 'Valor principal de la medición.',
  })
  value!: number;

  @ApiPropertyOptional({
    example: 80,
    description: 'Segundo valor de la medición, si aplica.',
  })
  secondValue?: number | null;

  @ApiProperty({
    example: 'mg/dL',
    description: 'Unidad de medida.',
  })
  unit!: string;

  @ApiPropertyOptional({
    example: 'Medición tomada antes del desayuno.',
    description: 'Notas de la medición.',
  })
  notes?: string | null;

  @ApiProperty({
    example: '2026-07-06T08:30:00.000Z',
    description: 'Fecha y hora en que se realizó la medición.',
  })
  measuredAt!: Date;

  @ApiProperty({
    example: '2026-07-06T09:00:00.000Z',
    description: 'Fecha de creación del registro.',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-07-06T09:00:00.000Z',
    description: 'Fecha de última actualización del registro.',
  })
  updatedAt!: Date;

  constructor(partial: Partial<MedicalMeasurementEntity>) {
    // Permite hidratar la entidad desde Prisma sin acoplarla al modelo generado.
    Object.assign(this, partial);
  }
}
