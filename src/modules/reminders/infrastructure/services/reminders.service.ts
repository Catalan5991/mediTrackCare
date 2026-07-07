import { Injectable } from '@nestjs/common';

import { CreateReminderDto } from '../../application/dtos/create-reminder.dto';
import { FindRemindersDto } from '../../application/dtos/find-reminders.dto';
import { UpdateReminderDto } from '../../application/dtos/update-reminder.dto';
import { CreateReminderUseCase } from '../../application/use-cases/create-reminder.use-case';
import { DeleteReminderUseCase } from '../../application/use-cases/delete-reminder.use-case';
import { FindReminderByIdUseCase } from '../../application/use-cases/find-reminder-by-id.use-case';
import { FindRemindersUseCase } from '../../application/use-cases/find-reminders.use-case';
import { UpdateReminderUseCase } from '../../application/use-cases/update-reminder.use-case';

@Injectable()
// Fachada de infraestructura que mantiene el controller desacoplado de los casos de uso.
export class RemindersService {
  constructor(
    private readonly createReminderUseCase: CreateReminderUseCase,
    private readonly findRemindersUseCase: FindRemindersUseCase,
    private readonly findReminderByIdUseCase: FindReminderByIdUseCase,
    private readonly updateReminderUseCase: UpdateReminderUseCase,
    private readonly deleteReminderUseCase: DeleteReminderUseCase,
  ) {}

  create(dto: CreateReminderDto) {
    // Cada metodo delega una accion HTTP en su caso de uso correspondiente.
    return this.createReminderUseCase.execute(dto);
  }

  findAll(filters: FindRemindersDto) {
    return this.findRemindersUseCase.execute(filters);
  }

  findOne(id: number) {
    return this.findReminderByIdUseCase.execute(id);
  }

  update(id: number, dto: UpdateReminderDto) {
    return this.updateReminderUseCase.execute(id, dto);
  }

  remove(id: number) {
    return this.deleteReminderUseCase.execute(id);
  }
}
