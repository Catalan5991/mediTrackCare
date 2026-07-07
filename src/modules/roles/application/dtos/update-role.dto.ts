import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

// Entrada parcial para modificar roles. Al ser PATCH, cada campo es opcional y
// el repositorio actualiza solo los valores enviados.
export class UpdateRoleDto {
  @ApiPropertyOptional({
    example: 'CUIDADOR',
    description: 'Nombre unico del rol dentro del sistema.',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Usuario responsable de apoyar el seguimiento del paciente.',
    description: 'Descripcion funcional del rol.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Estado activo del rol.',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
