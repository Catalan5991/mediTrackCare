import { Injectable } from '@nestjs/common';
import {
  NotificationStatus,
  Prisma,
} from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationMapper } from '../mappers/notification.mapper';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import {
  CreateNotificationData,
  INotificationsRepository,
  NotificationFilters,
  PaginatedNotifications,
  UpdateNotificationData,
} from '../../domain/interfaces/notifications.repository.interface';

@Injectable()
// Implementacion del repositorio de notificaciones usando Prisma.
export class PrismaNotificationsRepository implements INotificationsRepository {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param prisma Servicio que coordina las operaciones de prisma.
   */
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Crea un notificacion con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async create(data: CreateNotificationData): Promise<NotificationEntity> {
    // El mapper mantiene fuera de Prisma los detalles del contrato de dominio.
    const notification = await this.prisma.notification.create({
      data: NotificationMapper.toPrismaCreate(data),
    });

    return NotificationMapper.toEntity(notification);
  }
  /**
   * Obtiene el listado de notificacions que cumplen los filtros indicados.
   * @param filters Valor de filters requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findAll(filters: NotificationFilters): Promise<PaginatedNotifications> {
    // Limita la paginacion para evitar consultas demasiado grandes.
    const page = Math.max(Number(filters.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(filters.limit ?? 10), 1), 100);
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {};

    // Construye el filtro solo con valores presentes.
    if (filters.userId !== undefined) {
      where.userId = filters.userId;
    }

    if (filters.patientId !== undefined) {
      where.patientId = filters.patientId;
    }

    if (filters.intakeId !== undefined) {
      where.intakeId = filters.intakeId;
    }

    if (filters.type !== undefined) {
      where.type = filters.type;
    }

    if (filters.status !== undefined) {
      where.status = filters.status;
    }

    if (filters.search) {
      // Busqueda simple sobre titulo y mensaje, sin sensibilidad a mayusculas.
      where.OR = [
        {
          title: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          message: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {
        gte: filters.dateFrom,
        lte: filters.dateTo,
      };
    }

    // Lista y total se calculan juntos para mantener consistente la paginacion.
    const [notifications, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({
        where,
      }),
    ]);

    return {
      data: notifications.map(NotificationMapper.toEntity),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  /**
   * Actualiza un notificacion existente.
   * @param id Identificador único del recurso.
   * @param data Valor de data requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async update(
    id: number,
    data: UpdateNotificationData,
  ): Promise<NotificationEntity> {
    const notification = await this.prisma.notification.update({
      where: { id },
      data: NotificationMapper.toPrismaUpdate(data),
    });

    return NotificationMapper.toEntity(notification);
  }
  /**
   * Ejecuta la operación mark as read.
   * @param id Identificador único del recurso.
   * @param readAt Valor de read at requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async markAsRead(id: number, readAt: Date): Promise<NotificationEntity> {
    // Actualiza estado y marca temporal de lectura en una sola operacion.
    const notification = await this.prisma.notification.update({
      where: { id },
      data: {
        status: NotificationStatus.LEIDA,
        readAt,
      },
    });

    return NotificationMapper.toEntity(notification);
  }
  /**
   * Ejecuta la operación mark as sent.
   * @param id Identificador único del recurso.
   * @param sentAt Valor de sent at requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async markAsSent(id: number, sentAt: Date): Promise<NotificationEntity> {
    // Actualiza estado y marca temporal de envio en una sola operacion.
    const notification = await this.prisma.notification.update({
      where: { id },
      data: {
        status: NotificationStatus.ENVIADA,
        sentAt,
      },
    });

    return NotificationMapper.toEntity(notification);
  }

  /**
   * Obtiene un notificacion por su identificador.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findById(id: number): Promise<NotificationEntity | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return null;
    }

    return NotificationMapper.toEntity(notification);
  }

  /**
   * Elimina un notificacion por su identificador.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   */
  async delete(id: number): Promise<void> {
    await this.prisma.notification.delete({
      where: { id },
    });
  }
}
