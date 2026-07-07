import { CreateReminderDto } from '../../application/dtos/create-reminder.dto';
import { FindRemindersDto } from '../../application/dtos/find-reminders.dto';
import { UpdateReminderDto } from '../../application/dtos/update-reminder.dto';
import { ReminderEntity } from '../entities/reminder.entity';

export const REMINDERS_REPOSITORY = 'REMINDERS_REPOSITORY';

// Forma comun de respuesta para listados paginados de recordatorios.
export interface RemindersPaginatedResponse {
  data: ReminderEntity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

// Contrato que desacopla los casos de uso de la implementacion con Prisma.
export interface RemindersRepository {
  create(data: CreateReminderDto): Promise<ReminderEntity>;

  findAll(filters: FindRemindersDto): Promise<RemindersPaginatedResponse>;

  findById(id: number): Promise<ReminderEntity | null>;

  update(id: number, data: UpdateReminderDto): Promise<ReminderEntity>;

  delete(id: number): Promise<void>;
}
