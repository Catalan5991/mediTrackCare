import { Inject, Injectable } from '@nestjs/common';
import { UpdateReminderDto } from '../dtos/update-reminder.dto';
import { ReminderEntity } from '../../domain/entities/reminder.entity';
import { ReminderNotFoundException } from '../../domain/exceptions/reminder-not-found.exception';
import {
  REMINDERS_REPOSITORY,
  RemindersRepository,
} from '../../domain/interfaces/reminders.repository.interface';

@Injectable()
// Valida existencia antes de aplicar cambios parciales sobre un recordatorio.
export class UpdateReminderUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(REMINDERS_REPOSITORY)
    private readonly repository: RemindersRepository,
  ) {}
  /**
   * Actualiza un recordatorio aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {ReminderNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number, dto: UpdateReminderDto): Promise<ReminderEntity> {
    const reminder = await this.repository.findById(id);

    // Se comprueba primero para devolver un error claro antes del update.
    if (!reminder) {
      throw new ReminderNotFoundException(id);
    }

    return this.repository.update(id, dto);
  }
}
