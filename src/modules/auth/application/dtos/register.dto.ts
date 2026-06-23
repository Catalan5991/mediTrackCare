import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Entrada validada para crear una cuenta local con correo y contrasena.
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
