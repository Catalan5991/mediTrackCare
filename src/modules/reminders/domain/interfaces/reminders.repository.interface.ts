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
  /**
   * Crea un recordatorio con los datos recibidos.
   * @param data Datos de data validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(data: CreateReminderDto): Promise<ReminderEntity>;
  /**
   * Obtiene el listado de recordatorios que cumplen los filtros indicados.
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(filters: FindRemindersDto): Promise<RemindersPaginatedResponse>;
  /**
   * Obtiene un recordatorio por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<ReminderEntity | null>;
  /**
   * Actualiza un recordatorio existente.
   * @param id Identificador único del recurso.
   * @param data Datos de data validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, data: UpdateReminderDto): Promise<ReminderEntity>;

  /**
   * Elimina el recurso solicitado.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   */
  delete(id: number): Promise<void>;
}
