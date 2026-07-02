import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

// Entrada parcial para modificar solo los campos recibidos.
export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Maria Lopez',
    description: 'Nombre completo del usuario.',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'maria.lopez@example.com',
    description: 'Correo electronico unico del usuario.',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'Password123',
    minLength: 6,
    description: 'Nueva contrasena del usuario.',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    example: 'PATIENT',
    enum: ['PATIENT', 'CAREGIVER', 'DOCTOR', 'ADMIN'],
    description: 'Rol asignado al usuario.',
  })
  @IsOptional()
  @IsString()
  @IsIn(['PATIENT', 'CAREGIVER', 'DOCTOR', 'ADMIN'])
  role?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Estado activo del usuario.',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
