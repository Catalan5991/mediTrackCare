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
  constructor(
    @Inject(REMINDERS_REPOSITORY)
    private readonly repository: RemindersRepository,
  ) {}

  execute(filters: FindRemindersDto): Promise<RemindersPaginatedResponse> {
    return this.repository.findAll(filters);
  }
}
