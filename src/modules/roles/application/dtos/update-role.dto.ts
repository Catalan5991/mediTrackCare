import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { SystemRole } from '../../../../common/enums/system-role.enum';

// Entrada parcial para modificar roles. Al ser PATCH, cada campo es opcional y
// el repositorio actualiza solo los valores enviados.
export class UpdateRoleDto {
  @ApiPropertyOptional({
    example: SystemRole.CAREGIVER,
    enum: SystemRole,
    description: 'Nombre del catálogo de roles soportado por la matriz de permisos.',
  })
  @IsOptional()
  @IsEnum(SystemRole)
  name?: SystemRole;

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
