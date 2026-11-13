import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePrescriptionItemDto } from './create-prescription-item.dto';

// Valida el cuerpo necesario para crear una receta medica.
export class CreatePrescriptionDto {
  @ApiPropertyOptional({
    description:
      'UUID generado por el cliente para reintentos idempotentes de creacion.',
  })
  @IsOptional()
  @IsUUID()
  idempotencyKey?: string;
  @ApiProperty({ example: 1, minimum: 1, description: 'Id del paciente.' })
  @IsInt()
  @IsPositive()
  patientId!: number;

  @ApiPropertyOptional({
    example: 2,
    minimum: 1,
    description: 'Id del doctor que emite la receta.',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  doctorId?: number;

  @ApiPropertyOptional({
    example: 'Faringitis aguda',
    description: 'Diagnostico asociado.',
  })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiPropertyOptional({
    example: 'Mantener hidratacion y reposo.',
    description: 'Indicaciones generales.',
  })
  @IsString()
  @IsOptional()
  generalInstructions?: string;

  @ApiPropertyOptional({
    example: '2026-07-01',
    description: 'Fecha de emision en formato ISO.',
  })
  @IsDateString()
  @IsOptional()
  issueDate?: string;

  @ApiPropertyOptional({
    example: '2026-07-15',
    description: 'Fecha de expiracion en formato ISO.',
  })
  @IsDateString()
  @IsOptional()
  expirationDate?: string;

  // La receta debe incluir al menos un medicamento indicado.
  @ApiProperty({
    type: [CreatePrescriptionItemDto],
    description: 'Medicamentos incluidos en la receta.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionItemDto)
  items!: CreatePrescriptionItemDto[];
}
