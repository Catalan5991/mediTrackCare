import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateMedicationDto } from './create-medication.dto';

// Entrada parcial para modificar datos del medicamento o cambiar su estado.
export class UpdateMedicationDto extends PartialType(CreateMedicationDto) {
  @ApiPropertyOptional({
    example: true,
    description: 'Estado activo del medicamento.',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
