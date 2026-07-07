import { Inject, Injectable } from '@nestjs/common';
import { ReminderNotFoundException } from '../../domain/exceptions/reminder-not-found.exception';
import {
  REMINDERS_REPOSITORY,
  RemindersRepository,
} from '../../domain/interfaces/reminders.repository.interface';

@Injectable()
// Elimina recordatorios solo despues de confirmar que el registro existe.
export class DeleteReminderUseCase {
  constructor(
    @Inject(REMINDERS_REPOSITORY)
    private readonly repository: RemindersRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const reminder = await this.repository.findById(id);

    // La verificacion evita exponer errores tecnicos del motor de datos.
    if (!reminder) {
      throw new ReminderNotFoundException(id);
    }

    await this.repository.delete(id);
  }
}
