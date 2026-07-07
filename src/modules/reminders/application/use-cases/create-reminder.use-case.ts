import { Inject, Injectable } from '@nestjs/common';
import { CreateReminderDto } from '../dtos/create-reminder.dto';
import { ReminderEntity } from '../../domain/entities/reminder.entity';
import {
  REMINDERS_REPOSITORY,
  RemindersRepository,
} from '../../domain/interfaces/reminders.repository.interface';

@Injectable()
// Caso de uso encargado de delegar el registro de recordatorios al repositorio.
export class CreateReminderUseCase {
  constructor(
    @Inject(REMINDERS_REPOSITORY)
    private readonly repository: RemindersRepository,
  ) {}

  execute(dto: CreateReminderDto): Promise<ReminderEntity> {
    // La persistencia valida relaciones con paciente e item de receta.
    return this.repository.create(dto);
  }
}
