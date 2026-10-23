import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
export class TreatmentPreferencesDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional({ minimum: 0, maximum: 1440 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1440)
  advanceMinutes?: number;
  @ApiPropertyOptional({ minimum: 1, maximum: 1440 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1440)
  repeatMinutes?: number;
  @ApiPropertyOptional({ minimum: 0, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  repeatCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyCaregiver?: boolean;
  @ApiPropertyOptional({
    description:
      'Confirmar recepcion de las indicaciones; no modifica dosis ni horarios.',
  })
  @IsOptional()
  @IsBoolean()
  confirmTreatment?: boolean;
}
