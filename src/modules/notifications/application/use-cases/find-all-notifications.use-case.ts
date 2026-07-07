import { Inject, Injectable } from '@nestjs/common';
import { QueryNotificationsDto } from '../dtos/query-notifications.dto';
import {
  INotificationsRepository,
  NOTIFICATIONS_REPOSITORY,
  PaginatedNotifications,
} from '../../domain/interfaces/notifications.repository.interface';

@Injectable()
// Caso de uso de consulta que traduce query params a filtros del dominio.
export class FindAllNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: INotificationsRepository,
  ) {}

  async execute(query: QueryNotificationsDto): Promise<PaginatedNotifications> {
    // Normaliza fechas y paginacion antes de delegar la consulta.
    return this.notificationsRepository.findAll({
      userId: query.userId,
      patientId: query.patientId,
      intakeId: query.intakeId,
      type: query.type,
      status: query.status,
      search: query.search,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
    });
  }
}
