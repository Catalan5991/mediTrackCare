import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

// Parametros de consulta para busqueda paginada de roles. Convierte query
// params de texto a numeros y booleanos antes de construir la consulta.
export class QueryRoleDto {
  @ApiPropertyOptional({
    example: 'CUIDADOR',
    description: 'Texto para buscar por nombre o descripcion.',
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

  @ApiPropertyOptional({
    example: true,
    description: 'Filtra por estado activo.',
  })
  @IsOptional()
  @Transform(({ value }) => {
    // Permite que ?isActive=true y ?isActive=false sean booleanos reales.
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}
