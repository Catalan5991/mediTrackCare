import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Maria Lopez' })
  name!: string;

  @ApiProperty({ example: 'maria.lopez@example.com' })
  email!: string;

  @ApiProperty({ example: 'PATIENT' })
  role!: string;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  updatedAt!: Date;
}

// Respuesta publica de autenticacion: token de acceso mas datos seguros del usuario.
export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ type: AuthUserResponseDto })
  user!: AuthUserResponseDto;
}
