import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SystemRole } from '../../../../common/enums/system-role.enum';

// Entrada validada para crear roles desde HTTP. Las validaciones se ejecutan
// antes de llegar al caso de uso, dejando ahi solo reglas de negocio.
export class CreateRoleDto {
  @ApiProperty({
    example: SystemRole.CAREGIVER,
    enum: SystemRole,
    description: 'Nombre del catálogo de roles soportado por la matriz de permisos.',
  })
  @IsEnum(SystemRole)
  name!: SystemRole;

  @ApiPropertyOptional({
    example: 'Usuario responsable de apoyar el seguimiento del paciente.',
    description: 'Descripcion funcional del rol.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
