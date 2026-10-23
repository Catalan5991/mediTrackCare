import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateIntakeDto } from './create-intake.dto';

// Reutiliza las reglas de creacion, pero permite actualizar campos parciales.
export class UpdateIntakeDto extends PartialType(CreateIntakeDto) {
  @ApiPropertyOptional({
    description:
      'Obligatorio para corregir una toma resuelta; requiere permisos clinicos.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  correctionReason?: string;
}
