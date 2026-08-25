import { NotFoundException } from '@nestjs/common';

// Error de dominio para operaciones sobre notificaciones inexistentes.
export class NotificationNotFoundException extends NotFoundException {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   */
  constructor(id: number) {
    super(`La notificación con ID ${id} no fue encontrada.`);
  }
}
