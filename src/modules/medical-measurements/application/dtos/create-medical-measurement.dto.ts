import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { MeasurementType } from '../../../../../generated/prisma/client';

// Define y valida los datos requeridos para registrar una medicion clinica.
export class CreateMedicalMeasurementDto {
  @ApiProperty({
    example: 1,
    description: 'ID del paciente al que pertenece la medición médica.',
  })
  @IsInt()
  @Min(1)
  patientId!: number;

  @ApiPropertyOptional({
    example: 2,
    description:
      'ID del usuario que registró la medición. Puede ser paciente, cuidador, doctor o administrador.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  registeredByUserId?: number;

  @ApiProperty({
    enum: MeasurementType,
    enumName: 'MeasurementType',
    example: 'GLUCOSE',
    description: 'Tipo de medición médica registrada.',
  })
  @IsEnum(MeasurementType)
  measurementType!: MeasurementType;

  @ApiProperty({
    example: 120.5,
    description:
      'Valor principal de la medición. Ejemplo: glucosa, peso, temperatura o presión sistólica.',
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2,
    },
    {
      message: 'El valor debe ser numérico y máximo con 2 decimales.',
    },
  )
  value!: number;

  @ApiPropertyOptional({
    example: 80,
    description:
      'Segundo valor de la medición. Se usa, por ejemplo, para presión arterial diastólica.',
  })
  @IsOptional()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2,
    },
    {
      message: 'El segundo valor debe ser numérico y máximo con 2 decimales.',
    },
  )
  // Valor complementario para mediciones compuestas, como presion arterial.
  secondValue?: number;

  @ApiProperty({
    example: 'mg/dL',
    description: 'Unidad de medida. Ejemplo: mg/dL, mmHg, kg, °C, bpm.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unit!: string;

  @ApiPropertyOptional({
    example: 'Medición tomada antes del desayuno.',
    description: 'Notas adicionales sobre la medición.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;

  @ApiProperty({
    example: '2026-07-06T08:30:00.000Z',
    description: 'Fecha y hora en que se realizó la medición médica.',
  })
  @IsDateString()
  measuredAt!: string;
}
