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
  constructor(
    @Inject(REMINDERS_REPOSITORY)
    private readonly repository: RemindersRepository,
  ) {}

  async execute(id: number): Promise<ReminderEntity> {
    const reminder = await this.repository.findById(id);

    // Mantiene una respuesta uniforme para recursos inexistentes.
    if (!reminder) {
      throw new ReminderNotFoundException(id);
    }

    return reminder;
  }
}
