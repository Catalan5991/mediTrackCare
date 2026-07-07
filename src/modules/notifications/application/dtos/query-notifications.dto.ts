import { ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationStatus, NotificationType } from '../../../../../generated/prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

// Agrupa filtros opcionales, busqueda textual y paginacion para el listado.
export class QueryNotificationsDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar por ID de usuario.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar por ID de paciente.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  patientId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar por ID de toma.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  intakeId?: number;

  @ApiPropertyOptional({
    enum: NotificationType,
    example: NotificationType.RECORDATORIO_TOMA,
    description: 'Filtrar por tipo de notificación.',
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({
    enum: NotificationStatus,
    example: NotificationStatus.PENDIENTE,
    description: 'Filtrar por estado de notificación.',
  })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @ApiPropertyOptional({
    example: 'medicamento',
    description: 'Buscar por título o mensaje.',
  })
  @IsOptional()
  @IsString()
  // Busca coincidencias en titulo o mensaje desde el repositorio.
  search?: string;

  @ApiPropertyOptional({
    example: '2026-07-01T00:00:00.000Z',
    description: 'Fecha inicial de creación.',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2026-07-31T23:59:59.000Z',
    description: 'Fecha final de creación.',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Número de página.',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Cantidad de registros por página.',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
