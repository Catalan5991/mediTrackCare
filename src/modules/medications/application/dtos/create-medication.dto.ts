import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MedicationForm, MedicationRoute } from '../../../../../generated/prisma/client';

export class CreateMedicationDto {
  @ApiProperty({ description: 'Nombre del medicamento', example: 'Paracetamol' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: 'Descripción o notas terapéuticas', example: 'Analgésico y antipirético' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Forma o presentación farmacéutica', enum: MedicationForm, example: 'TABLETA' })
  @IsEnum(MedicationForm)
  presentation!: MedicationForm;

  @ApiPropertyOptional({ description: 'Concentración del fármaco', example: '500 mg' })
  @IsString()
  @IsOptional()
  concentration?: string;

  @ApiPropertyOptional({ description: 'Unidad de medida', example: 'mg' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ description: 'Vía de administración', enum: MedicationRoute, example: 'ORAL' })
  @IsEnum(MedicationRoute)
  route!: MedicationRoute;
}