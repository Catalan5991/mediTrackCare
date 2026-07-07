import { NotificationStatus, NotificationType } from '../../../../../generated/prisma/client';
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
  create(data: CreateNotificationData): Promise<NotificationEntity>;

  findAll(filters: NotificationFilters): Promise<PaginatedNotifications>;

  findById(id: number): Promise<NotificationEntity | null>;

  update(id: number, data: UpdateNotificationData): Promise<NotificationEntity>;

  delete(id: number): Promise<void>;

  markAsRead(id: number, readAt: Date): Promise<NotificationEntity>;

  markAsSent(id: number, sentAt: Date): Promise<NotificationEntity>;
}
