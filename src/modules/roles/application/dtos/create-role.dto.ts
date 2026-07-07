import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

// Entrada validada para crear roles desde HTTP. Las validaciones se ejecutan
// antes de llegar al caso de uso, dejando ahi solo reglas de negocio.
export class CreateRoleDto {
  @ApiProperty({
    example: 'CUIDADOR',
    description: 'Nombre unico del rol dentro del sistema.',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    example: 'Usuario responsable de apoyar el seguimiento del paciente.',
    description: 'Descripcion funcional del rol.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
