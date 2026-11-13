import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Matches, Max, Min } from 'class-validator';
import { PrescriptionStatus } from '../../../../../generated/prisma/client';
export enum AgendaPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}
export class PatientAgendaDto {
  @ApiPropertyOptional({
    example: '2026-10-22',
    description: 'Fecha local del paciente; por defecto hoy.',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;
  @ApiPropertyOptional({ enum: AgendaPeriod, default: AgendaPeriod.DAY })
  @IsOptional()
  @IsEnum(AgendaPeriod)
  period: AgendaPeriod = AgendaPeriod.DAY;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  prescriptionItemId?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  medicationId?: number;
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
  @ApiPropertyOptional({ default: 100, maximum: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit: number = 100;
}
export class PatientMedicationsDto {
  @ApiPropertyOptional({ enum: ['all', 'active', 'completed'], default: 'all' })
  @IsOptional()
  @IsEnum({ all: 'all', active: 'active', completed: 'completed' })
  view?: 'all' | 'active' | 'completed';
  @ApiPropertyOptional({ enum: PrescriptionStatus })
  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
  @ApiPropertyOptional({ maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}

export class PatientActivityDto extends PickType(PatientMedicationsDto, [
  'page',
  'limit',
] as const) {}
