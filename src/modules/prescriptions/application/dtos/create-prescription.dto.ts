import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePrescriptionItemDto } from './create-prescription-item.dto';

// Valida el cuerpo necesario para crear una receta medica.
export class CreatePrescriptionDto {
  @IsInt()
  @IsPositive()
  patientId!: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  doctorId?: number;

  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  generalInstructions?: string;

  @IsDateString()
  @IsOptional()
  issueDate?: string;

  @IsDateString()
  @IsOptional()
  expirationDate?: string;

  // La receta debe incluir al menos un medicamento indicado.
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionItemDto)
  items!: CreatePrescriptionItemDto[];
}
