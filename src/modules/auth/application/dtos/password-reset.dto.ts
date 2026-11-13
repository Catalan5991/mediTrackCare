import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
export class ForgotPasswordDto {
  @ApiProperty({ example: 'maria@example.com' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email!: string;
}
export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token recibido por correo.',
    minLength: 64,
    maxLength: 64,
  })
  @IsString()
  @Matches(/^[a-f0-9]{64}$/)
  token!: string;
  @ApiProperty({
    minLength: 6,
    maxLength: 72,
    description: 'Nueva contrasena (maximo 72 bytes UTF-8).',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  newPassword!: string;
}
export class PasswordResetResponseDto {
  @ApiProperty()
  message!: string;
}
