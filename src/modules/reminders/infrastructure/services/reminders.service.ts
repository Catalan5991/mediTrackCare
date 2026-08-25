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
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param createReminderUseCase Caso de uso encargado de create reminder use case.
   * @param findRemindersUseCase Caso de uso encargado de find reminders use case.
   * @param findReminderByIdUseCase Caso de uso encargado de find reminder by id use case.
   * @param updateReminderUseCase Caso de uso encargado de update reminder use case.
   * @param deleteReminderUseCase Caso de uso encargado de delete reminder use case.
   */
  constructor(
    private readonly createReminderUseCase: CreateReminderUseCase,
    private readonly findRemindersUseCase: FindRemindersUseCase,
    private readonly findReminderByIdUseCase: FindReminderByIdUseCase,
    private readonly updateReminderUseCase: UpdateReminderUseCase,
    private readonly deleteReminderUseCase: DeleteReminderUseCase,
  ) {}
  /**
   * Crea un recordatorio con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(dto: CreateReminderDto) {
    // Cada metodo delega una accion HTTP en su caso de uso correspondiente.
    return this.createReminderUseCase.execute(dto);
  }
  /**
   * Obtiene el listado de recordatorios que cumplen los filtros indicados.
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(filters: FindRemindersDto) {
    return this.findRemindersUseCase.execute(filters);
  }
  /**
   * Obtiene un recordatorio por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findOne(id: number) {
    return this.findReminderByIdUseCase.execute(id);
  }
  /**
   * Actualiza un recordatorio existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, dto: UpdateReminderDto) {
    return this.updateReminderUseCase.execute(id, dto);
  }
  /**
   * Elimina un recordatorio por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  remove(id: number) {
    return this.deleteReminderUseCase.execute(id);
  }
}
