import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PrescriptionStatus } from '../../../../../generated/prisma/client';

// Parametros de consulta disponibles para listar y filtrar recetas.
export class FindPrescriptionsQueryDto {
  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    description: 'Filtra por paciente.',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  patientId?: number;

  @ApiPropertyOptional({
    example: 2,
    minimum: 1,
    description: 'Filtra por doctor.',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  doctorId?: number;

  @ApiPropertyOptional({
    enum: PrescriptionStatus,
    example: PrescriptionStatus.ACTIVO,
  })
  @IsEnum(PrescriptionStatus)
  @IsOptional()
  status?: PrescriptionStatus;

  @ApiPropertyOptional({
    example: 'faringitis',
    description: 'Texto de busqueda.',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
