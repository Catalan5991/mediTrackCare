import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

// Entrada validada para crear una relacion de cuidado desde HTTP. Los
// decoradores de class-validator protegen tipos y rangos antes de ejecutar
// reglas de negocio en los casos de uso.
export class CreateCaregiverDto {
  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'Id del usuario que actuara como cuidador.',
  })
  @IsInt()
  @Min(1)
  userId!: number;

  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'Id del paciente asociado al cuidador.',
  })
  @IsInt()
  @Min(1)
  patientId!: number;

  @ApiProperty({
    example: 'Hijo',
    description: 'Relacion del cuidador con el paciente.',
  })
  @IsString()
  relationship!: string;

  @ApiPropertyOptional({
    example: true,
    default: false,
    description: 'Indica si es el cuidador principal del paciente.',
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
