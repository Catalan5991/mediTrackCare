import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

// Valida cada medicamento incluido dentro de una receta.
export class CreatePrescriptionItemDto {
  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'Id del medicamento indicado.',
  })
  @IsInt()
  @IsPositive()
  medicationId!: number;

  @ApiProperty({ example: '500 mg', description: 'Dosis indicada.' })
  @IsString()
  @IsNotEmpty()
  dose!: string;

  @ApiProperty({
    example: 'Cada 8 horas',
    description: 'Frecuencia de administracion.',
  })
  @IsString()
  @IsNotEmpty()
  frequency!: string;

  @ApiPropertyOptional({
    example: '7 dias',
    description: 'Duracion del tratamiento.',
  })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiPropertyOptional({ example: 'Tomar despues de alimentos.' })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiPropertyOptional({
    example: '2026-07-01',
    description: 'Fecha de inicio en formato ISO.',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-07-08',
    description: 'Fecha de fin en formato ISO.',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    example: 21,
    minimum: 1,
    description: 'Cantidad total indicada.',
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;
}
