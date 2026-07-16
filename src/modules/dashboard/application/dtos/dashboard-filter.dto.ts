import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

// Periodos soportados por el dashboard. Se usan valores cortos para mantener
// URLs simples y faciles de consumir desde frontend.
export enum DashboardPeriod {
  SEVEN_DAYS = '7d',
  THIRTY_DAYS = '30d',
  NINETY_DAYS = '90d',
}

// DTO de query params compartido por los endpoints admin y patient/me.
export class DashboardFilterDto {
  @ApiPropertyOptional({
    enum: DashboardPeriod,
    enumName: 'DashboardPeriod',
    example: DashboardPeriod.THIRTY_DAYS,
    default: DashboardPeriod.THIRTY_DAYS,
    description: 'Periodo de analisis para metricas y graficas.',
  })
  @IsOptional()
  @IsEnum(DashboardPeriod)
  period?: DashboardPeriod = DashboardPeriod.THIRTY_DAYS;
}
