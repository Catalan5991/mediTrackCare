import { ApiProperty } from '@nestjs/swagger';

// Respuesta publica del modulo Users; nunca incluye password.
export class UserResponseDto {
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
