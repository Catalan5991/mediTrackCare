import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { IntakeStatus } from '../../../../../generated/prisma/client';

// Agrupa los filtros opcionales de consulta y los parametros de paginacion.
export class FindIntakesDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar tomas por ID del paciente.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  patientId?: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'Filtrar tomas por ID del item de receta.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  prescriptionItemId?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Filtrar tomas por ID del recordatorio.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  reminderId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Filtrar tomas por ID del usuario que las confirmo.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  confirmedByUserId?: number;

  @ApiPropertyOptional({
    enum: IntakeStatus,
    enumName: 'IntakeStatus',
    example: IntakeStatus.PENDIENTE,
    description: 'Filtrar tomas por estado.',
  })
  @IsOptional()
  @IsEnum(IntakeStatus)
  status?: IntakeStatus;

  @ApiPropertyOptional({
    example: '2026-07-01T00:00:00.000Z',
    description: 'Fecha inicial para filtrar por fecha programada.',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2026-07-31T23:59:59.000Z',
    description: 'Fecha final para filtrar por fecha programada.',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Numero de pagina.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Cantidad de registros por pagina.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
