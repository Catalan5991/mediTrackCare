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
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  patientId?: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  doctorId?: number;

  @IsEnum(PrescriptionStatus)
  @IsOptional()
  status?: PrescriptionStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
