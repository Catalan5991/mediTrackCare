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
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  @IsIn(['PATIENT', 'CAREGIVER', 'DOCTOR', 'ADMIN'])
  role?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
