import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsArray,
  ArrayMaxSize,
  ArrayUnique,
  IsTimeZone,
  Matches,
  Max,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

// Valida cada medicamento incluido dentro de una receta.
export class CreatePrescriptionItemDto {
  @ApiPropertyOptional({
    example: ['08:00', '20:00'],
    description:
      'Horarios clinicos locales; solo un profesional autorizado puede cambiarlos.',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(24)
  @ArrayUnique()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { each: true })
  scheduledTimes?: string[];
  @ApiPropertyOptional({
    example: [1, 2, 3, 4, 5],
    description: '0=domingo; lista vacia significa todos los dias.',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  daysOfWeek?: number[];
  @ApiPropertyOptional({ example: 'America/Mexico_City' })
  @IsOptional()
  @IsTimeZone()
  timeZone?: string;
  @ApiPropertyOptional({ example: 'mg' })
  @IsOptional()
  @IsString()
  doseUnit?: string;
  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'Id del medicamento indicado.',
  })
  @IsInt()
  @IsPositive()
  medicationId!: number;

  @ApiProperty({ example: '500 mg', description: 'Dosis indicada.' })
  @IsString()
  @IsNotEmpty()
  dose!: string;

  @ApiProperty({
    example: 'Cada 8 horas',
    description: 'Frecuencia de administracion.',
  })
  @IsString()
  @IsNotEmpty()
  frequency!: string;

  @ApiPropertyOptional({
    example: '7 dias',
    description: 'Duracion del tratamiento.',
  })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiPropertyOptional({ example: 'Tomar despues de alimentos.' })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiPropertyOptional({
    example: '2026-07-01',
    description: 'Fecha de inicio en formato ISO.',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-07-08',
    description: 'Fecha de fin en formato ISO.',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    example: 21,
    minimum: 1,
    description: 'Cantidad total indicada.',
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;
}
