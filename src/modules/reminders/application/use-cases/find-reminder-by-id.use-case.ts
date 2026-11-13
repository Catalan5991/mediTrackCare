import { Inject, Injectable } from '@nestjs/common';
import { ReminderEntity } from '../../domain/entities/reminder.entity';
import { ReminderNotFoundException } from '../../domain/exceptions/reminder-not-found.exception';
import {
  REMINDERS_REPOSITORY,
  RemindersRepository,
} from '../../domain/interfaces/reminders.repository.interface';

@Injectable()
// Centraliza la busqueda por ID y traduce ausencias a una excepcion de dominio.
export class FindReminderByIdUseCase {
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
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {ReminderNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<ReminderEntity> {
    const reminder = await this.repository.findById(id);

    // Mantiene una respuesta uniforme para recursos inexistentes.
    if (!reminder) {
      throw new ReminderNotFoundException(id);
    }

    return reminder;
  }
}
