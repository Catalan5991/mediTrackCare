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
  constructor(
    @Inject(REMINDERS_REPOSITORY)
    private readonly repository: RemindersRepository,
  ) {}

  async execute(id: number, dto: UpdateReminderDto): Promise<ReminderEntity> {
    const reminder = await this.repository.findById(id);

    // Se comprueba primero para devolver un error claro antes del update.
    if (!reminder) {
      throw new ReminderNotFoundException(id);
    }

    return this.repository.update(id, dto);
  }
}
