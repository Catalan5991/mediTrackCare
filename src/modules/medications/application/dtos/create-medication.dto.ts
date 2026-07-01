import {IsEnum,IsNotEmpty,IsOptional,IsString,MaxLength,MinLength} from 'class-validator';
import { MedicationForm, MedicationRoute } from '../../../../../generated/prisma/client';

export class CreateMedicationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string;

  @IsEnum(MedicationForm)
  presentation!: MedicationForm;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  concentration?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

  @IsEnum(MedicationRoute)
  route!: MedicationRoute;
}
