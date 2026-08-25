import { NotFoundException } from '@nestjs/common';

// Error de negocio para operaciones sobre recordatorios inexistentes.
export class ReminderNotFoundException extends NotFoundException {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   */
  constructor(id: number) {
    super(`El recordatorio con ID ${id} no fue encontrado.`);
  }
}
