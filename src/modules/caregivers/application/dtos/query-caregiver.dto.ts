import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

// Parametros de consulta para busqueda paginada de cuidadores. Convierte los
// query params, que llegan como texto, a numeros y booleanos antes de consultar.
export class QueryCaregiverDto {
  @ApiPropertyOptional({
    example: 'Hijo',
    description: 'Texto para buscar por relacion.',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, default: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  patientId?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Filtra por cuidador principal.',
  })
  @IsOptional()
  @Transform(({ value }) => {
    // Permite que ?isPrimary=true y ?isPrimary=false sean booleanos reales.
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Filtra por estado activo.',
  })
  @IsOptional()
  @Transform(({ value }) => {
    // Mantiene el mismo contrato booleano para filtrar registros activos.
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}
