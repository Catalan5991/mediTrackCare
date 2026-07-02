import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  MedicationForm,
  MedicationRoute,
} from '../../../../../generated/prisma/client';

// Entrada validada para registrar medicamentos dentro del catalogo.
export class CreateMedicationDto {
  @ApiProperty({ example: 'Paracetamol', minLength: 2, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({
    example: 'Analgesico y antipiretico.',
    maxLength: 250,
  })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string;

  @ApiProperty({ enum: MedicationForm, example: MedicationForm.TABLETA })
  @IsEnum(MedicationForm)
  presentation!: MedicationForm;

  @ApiPropertyOptional({ example: '500 mg', maxLength: 80 })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  concentration?: string;

  @ApiPropertyOptional({ example: 'mg', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

  @ApiProperty({ enum: MedicationRoute, example: MedicationRoute.ORAL })
  @IsEnum(MedicationRoute)
  route!: MedicationRoute;
}
