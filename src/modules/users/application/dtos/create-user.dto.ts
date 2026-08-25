import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { SystemRole } from '../../../../common/enums/system-role.enum';

// Entrada validada para crear usuarios desde la API administrativa.
export class CreateUserDto {
  @ApiProperty({
    example: 'Maria Lopez',
    description: 'Nombre completo del usuario.',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'maria.lopez@example.com',
    description: 'Correo electronico unico del usuario.',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123',
    minLength: 6,
    description: 'Contrasena inicial del usuario.',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  // Si no se envia, el repositorio/schema puede aplicar el rol por defecto.
  @ApiPropertyOptional({
    example: 'PATIENT',
    enum: SystemRole,
    description: 'Rol asignado al usuario.',
  })
  @IsOptional()
  @IsEnum(SystemRole)
  role?: SystemRole;

  @ApiPropertyOptional({
    example: true,
    description: 'Estado activo del usuario.',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
