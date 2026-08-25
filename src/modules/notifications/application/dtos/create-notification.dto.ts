import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  NotificationStatus,
  NotificationType,
} from '../../../../../generated/prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// Define los datos permitidos para crear una notificacion dirigida a un usuario.
export class CreateNotificationDto {
  @ApiProperty({
    example: 1,
    description: 'ID del usuario que recibirá la notificación.',
  })
  @Type(() => Number)
  @IsInt()
  userId!: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID del paciente relacionado con la notificación.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  patientId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID de la toma relacionada con la notificación.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  intakeId?: number;

  @ApiProperty({
    example: 'Recordatorio de medicamento',
    description: 'Título de la notificación.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiProperty({
    example: 'Es momento de tomar Paracetamol 500mg.',
    description: 'Mensaje detallado de la notificación.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message!: string;

  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.RECORDATORIO_TOMA,
    description: 'Tipo de notificación.',
  })
  @IsEnum(NotificationType)
  type!: NotificationType;

  @ApiPropertyOptional({
    enum: NotificationStatus,
    example: NotificationStatus.PENDIENTE,
    description: 'Estado inicial de la notificación.',
  })
  @IsOptional()
  @IsEnum(NotificationStatus)
  // Si no se envia, la base de datos puede aplicar el estado por defecto.
  status?: NotificationStatus;

  @ApiPropertyOptional({
    example: '2026-07-06T15:30:00.000Z',
    description: 'Fecha en la que fue enviada la notificación.',
  })
  @IsOptional()
  @IsDateString()
  sentAt?: string;

  @ApiPropertyOptional({
    example: '2026-07-06T16:00:00.000Z',
    description: 'Fecha en la que fue leída la notificación.',
  })
  @IsOptional()
  @IsDateString()
  readAt?: string;
}
