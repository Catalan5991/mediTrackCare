import { ApiPropertyOptional } from '@nestjs/swagger';
import { MeasurementType } from '../../../../../generated/prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

// Agrupa los filtros opcionales de consulta y los parametros de paginacion.
export class FindMedicalMeasurementsDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar mediciones por ID del paciente.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  patientId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Filtrar mediciones por ID del usuario que las registró.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  registeredByUserId?: number;

  @ApiPropertyOptional({
    enum: MeasurementType,
    enumName: 'MeasurementType',
    example: 'GLUCOSE',
    description: 'Filtrar mediciones por tipo.',
  })
  @IsOptional()
  @IsEnum(MeasurementType)
  measurementType?: MeasurementType;

  @ApiPropertyOptional({
    example: '2026-07-01T00:00:00.000Z',
    description: 'Fecha inicial para filtrar mediciones.',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2026-07-31T23:59:59.000Z',
    description: 'Fecha final para filtrar mediciones.',
  })
  @IsOptional()
  @IsDateString()
  // Limite superior del rango; se valida contra dateFrom en el caso de uso.
  dateTo?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Número de página.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Cantidad de registros por página.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
