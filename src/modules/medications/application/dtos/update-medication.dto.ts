import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateMedicationDto } from './create-medication.dto';

// Entrada parcial para modificar datos del medicamento o cambiar su estado.
export class UpdateMedicationDto extends PartialType(CreateMedicationDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
