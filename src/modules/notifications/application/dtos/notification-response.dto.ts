import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationStatus, NotificationType } from '../../../../../generated/prisma/client';

// Forma publica de una notificacion devuelta por los endpoints HTTP.
export class NotificationResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  userId!: number;

  @ApiPropertyOptional({ example: 1 })
  patientId?: number | null;

  @ApiPropertyOptional({ example: 1 })
  intakeId?: number | null;

  @ApiProperty({ example: 'Recordatorio de medicamento' })
  title!: string;

  @ApiProperty({ example: 'Es momento de tomar Paracetamol 500mg.' })
  message!: string;

  @ApiProperty({ enum: NotificationType })
  type!: NotificationType;

  @ApiProperty({ enum: NotificationStatus })
  status!: NotificationStatus;

  @ApiPropertyOptional({ example: '2026-07-06T15:30:00.000Z' })
  sentAt?: Date | null;

  @ApiPropertyOptional({ example: '2026-07-06T16:00:00.000Z' })
  readAt?: Date | null;

  @ApiProperty({ example: '2026-07-06T15:00:00.000Z' })
  createdAt!: Date;
}

// Respuesta estandar para listados paginados de notificaciones.
export class PaginatedNotificationsResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  data!: NotificationResponseDto[];

  @ApiProperty({ example: 50 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}
