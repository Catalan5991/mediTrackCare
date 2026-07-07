import { NotificationStatus, NotificationType } from '../../../../../generated/prisma/client';

// Entidad de dominio que concentra datos y reglas de estado de una notificacion.
export class NotificationEntity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly patientId: number | null,
    public readonly intakeId: number | null,
    public readonly title: string,
    public readonly message: string,
    public readonly type: NotificationType,
    public readonly status: NotificationStatus,
    public readonly sentAt: Date | null,
    public readonly readAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  isPending(): boolean {
    return this.status === NotificationStatus.PENDIENTE;
  }

  isSent(): boolean {
    return this.status === NotificationStatus.ENVIADA;
  }

  isRead(): boolean {
    return this.status === NotificationStatus.LEIDA;
  }

  canBeMarkedAsSent(): boolean {
    return this.status === NotificationStatus.PENDIENTE;
  }

  canBeMarkedAsRead(): boolean {
    // Una notificacion pendiente puede leerse si el usuario la abre antes del envio.
    return this.status === NotificationStatus.ENVIADA || this.status === NotificationStatus.PENDIENTE;
  }
}
