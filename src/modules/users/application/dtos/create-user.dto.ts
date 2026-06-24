import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

// Entrada validada para crear usuarios desde la API administrativa.
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  // Si no se envia, el repositorio/schema puede aplicar el rol por defecto.
  @IsOptional()
  @IsString()
  @IsIn(['PATIENT', 'CAREGIVER', 'DOCTOR', 'ADMIN'])
  role?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
