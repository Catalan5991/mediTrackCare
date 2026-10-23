import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReminderDto } from '../dtos/create-reminder.dto';
import { ReminderEntity } from '../../domain/entities/reminder.entity';
import {
  REMINDERS_REPOSITORY,
  RemindersRepository,
} from '../../domain/interfaces/reminders.repository.interface';

@Injectable()
// Caso de uso encargado de delegar el registro de recordatorios al repositorio.
export class CreateReminderUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(REMINDERS_REPOSITORY)
    private readonly repository: RemindersRepository,
  ) {}
  /**
   * Crea un recordatorio aplicando las reglas del caso de uso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  execute(dto: CreateReminderDto): Promise<ReminderEntity> {
    if (dto.repeatCount && !dto.repeatMinutes)
      throw new BadRequestException('La repeticion requiere un intervalo.');
    // La persistencia valida relaciones con paciente e item de receta.
    return this.repository.create(dto);
  }
}
