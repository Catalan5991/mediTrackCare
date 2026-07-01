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
  @IsInt()
  @IsPositive()
  medicationId!: number;

  @IsString()
  @IsNotEmpty()
  dose!: string;

  @IsString()
  @IsNotEmpty()
  frequency!: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  instructions?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;
}
