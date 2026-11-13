import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
export class ResolveIntakeDto {
  @ApiPropertyOptional({
    description:
      'Instante real de administracion, ISO con zona horaria; por defecto ahora.',
  })
  @IsOptional()
  @IsDateString()
  takenAt?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;
  @ApiPropertyOptional({
    description:
      'Requerido para corregir una toma ya resuelta; permisos clinicos.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  correctionReason?: string;
}
