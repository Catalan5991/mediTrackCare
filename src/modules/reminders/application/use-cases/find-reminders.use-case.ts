import { Inject, Injectable } from '@nestjs/common';
import { FindRemindersDto } from '../dtos/find-reminders.dto';
import {
  REMINDERS_REPOSITORY,
  RemindersPaginatedResponse,
  RemindersRepository,
} from '../../domain/interfaces/reminders.repository.interface';

@Injectable()
// Caso de uso de lectura de recordatorios con filtros y paginacion.
export class FindRemindersUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(REMINDERS_REPOSITORY)
    private readonly repository: RemindersRepository,
  ) {}
  /**
   * Obtiene informacion de recordatorio segun los criterios indicados.
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  execute(filters: FindRemindersDto): Promise<RemindersPaginatedResponse> {
    return this.repository.findAll(filters);
  }
}
