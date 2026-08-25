import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

// Entrada parcial para modificar la relacion de cuidado. Al ser PATCH, todos
// los campos son opcionales y el caso de uso conserva los valores no enviados.
export class UpdateCaregiverDto {
  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    description: 'Id del usuario que actuara como cuidador.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    description: 'Id del paciente asociado al cuidador.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  patientId?: number;

  @ApiPropertyOptional({
    example: 'Hijo',
    description: 'Relacion del cuidador con el paciente.',
  })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si es el cuidador principal del paciente.',
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Estado activo de la relacion de cuidado.',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
