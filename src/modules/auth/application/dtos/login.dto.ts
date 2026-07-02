import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

// Datos minimos que necesita el caso de uso para autenticar credenciales.
export class LoginDto {
  @ApiProperty({
    example: 'maria.lopez@example.com',
    description: 'Correo electronico registrado.',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123',
    minLength: 6,
    description: 'Contrasena del usuario.',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
