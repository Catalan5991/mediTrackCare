import { Inject, Injectable } from '@nestjs/common';
import { ReminderNotFoundException } from '../../domain/exceptions/reminder-not-found.exception';
import {
  REMINDERS_REPOSITORY,
  RemindersRepository,
} from '../../domain/interfaces/reminders.repository.interface';

@Injectable()
// Elimina recordatorios solo despues de confirmar que el registro existe.
export class DeleteReminderUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(REMINDERS_REPOSITORY)
    private readonly repository: RemindersRepository,
  ) {}
  /**
   * Elimina un recordatorio aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   * @throws {ReminderNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<void> {
    const reminder = await this.repository.findById(id);

    // La verificacion evita exponer errores tecnicos del motor de datos.
    if (!reminder) {
      throw new ReminderNotFoundException(id);
    }

    await this.repository.delete(id);
  }
}
