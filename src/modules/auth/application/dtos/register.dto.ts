import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Entrada validada para crear una cuenta local con correo y contrasena.
export class RegisterDto {
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
    description: 'Contrasena de acceso.',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
