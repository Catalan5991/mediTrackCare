import {
  NotificationStatus,
  NotificationType,
} from '../../../../../generated/prisma/client';
import { NotificationEntity } from '../entities/notification.entity';

export const NOTIFICATIONS_REPOSITORY = 'NOTIFICATIONS_REPOSITORY';

// Datos normalizados que la capa de aplicacion envia para crear registros.
export interface CreateNotificationData {
  userId: number;
  patientId?: number | null;
  intakeId?: number | null;
  title: string;
  message: string;
  type: NotificationType;
  status?: NotificationStatus;
  sentAt?: Date | null;
  readAt?: Date | null;
}

// Campos opcionales para actualizaciones parciales sin sobrescribir undefined.
export interface UpdateNotificationData {
  userId?: number;
  patientId?: number | null;
  intakeId?: number | null;
  title?: string;
  message?: string;
  type?: NotificationType;
  status?: NotificationStatus;
  sentAt?: Date | null;
  readAt?: Date | null;
}

// Filtros ya transformados a tipos de dominio antes de consultar la base.
export interface NotificationFilters {
  userId?: number;
  patientId?: number;
  intakeId?: number;
  type?: NotificationType;
  status?: NotificationStatus;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

// Estructura comun de paginacion usada entre repositorio, service y controller.
export interface PaginatedNotifications {
  data: NotificationEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Contrato de persistencia para mantener los casos de uso desacoplados de Prisma.
export interface INotificationsRepository {
  /**
   * Crea un notificacion con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  create(data: CreateNotificationData): Promise<NotificationEntity>;
  /**
   * Obtiene el listado de notificacions que cumplen los filtros indicados.
   * @param filters Valor de filters requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(filters: NotificationFilters): Promise<PaginatedNotifications>;
  /**
   * Obtiene un notificacion por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<NotificationEntity | null>;
  /**
   * Actualiza un notificacion existente.
   * @param id Identificador único del recurso.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, data: UpdateNotificationData): Promise<NotificationEntity>;
  /**
   * Ejecuta la operación mark as read.
   * @param id Identificador único del recurso.
   * @param readAt Valor de read at requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  markAsRead(id: number, readAt: Date): Promise<NotificationEntity>;
  /**
   * Ejecuta la operación mark as sent.
   * @param id Identificador único del recurso.
   * @param sentAt Valor de sent at requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  markAsSent(id: number, sentAt: Date): Promise<NotificationEntity>;

  /**
   * Elimina un notificacion por su identificador.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   */
  delete(id: number): Promise<void>;
}
