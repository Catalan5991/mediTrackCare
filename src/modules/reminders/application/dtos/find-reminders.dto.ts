import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

// Agrupa los filtros opcionales de consulta y los parametros de paginacion.
export class FindRemindersDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar recordatorios por ID del paciente.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  patientId?: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'Filtrar recordatorios por ID del item de receta.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  prescriptionItemId?: number;

  @ApiPropertyOptional({
    example: '08:00',
    description: 'Filtrar recordatorios por hora programada en formato HH:mm.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'scheduledTime debe tener formato HH:mm.',
  })
  scheduledTime?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filtrar recordatorios por estado activo/inactivo.',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true') {
      return true;
    }

    if (value === false || value === 'false') {
      return false;
    }

    return value;
  })
  @IsBoolean()
  isActive?: boolean;

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
