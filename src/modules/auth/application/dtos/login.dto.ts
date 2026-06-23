import { IsEmail, IsString, MinLength } from 'class-validator';

// Datos minimos que necesita el caso de uso para autenticar credenciales.
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
