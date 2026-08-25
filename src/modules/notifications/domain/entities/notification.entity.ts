import {
  NotificationStatus,
  NotificationType,
} from '../../../../../generated/prisma/client';

// Entidad de dominio que concentra datos y reglas de estado de una notificacion.
export class NotificationEntity {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   * @param userId Valor de user id requerido por la operacion.
   * @param patientId Valor de patient id requerido por la operacion.
   * @param intakeId Valor de intake id requerido por la operacion.
   * @param title Valor de title requerido por la operacion.
   * @param message Valor de message requerido por la operacion.
   * @param type Valor de type requerido por la operacion.
   * @param status Valor de status requerido por la operacion.
   * @param sentAt Valor de sent at requerido por la operacion.
   * @param readAt Valor de read at requerido por la operacion.
   * @param createdAt Valor de created at requerido por la operacion.
   */
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
  /**
   * Ejecuta la operación is pending.
   * @returns Indica si la validación o condición se cumple.
   */
  isPending(): boolean {
    return this.status === NotificationStatus.PENDIENTE;
  }
  /**
   * Ejecuta la operación is sent.
   * @returns Indica si la validación o condición se cumple.
   */
  isSent(): boolean {
    return this.status === NotificationStatus.ENVIADA;
  }
  /**
   * Ejecuta la operación is read.
   * @returns Indica si la validación o condición se cumple.
   */
  isRead(): boolean {
    return this.status === NotificationStatus.LEIDA;
  }
  /**
   * Ejecuta la operación can be marked as sent.
   * @returns Indica si la validación o condición se cumple.
   */
  canBeMarkedAsSent(): boolean {
    return this.status === NotificationStatus.PENDIENTE;
  }
  /**
   * Ejecuta la operación can be marked as read.
   * @returns Indica si la validación o condición se cumple.
   */
  canBeMarkedAsRead(): boolean {
    // Una notificacion pendiente puede leerse si el usuario la abre antes del envio.
    return (
      this.status === NotificationStatus.ENVIADA ||
      this.status === NotificationStatus.PENDIENTE
    );
  }
}
