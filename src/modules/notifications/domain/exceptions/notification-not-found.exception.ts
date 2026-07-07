import { NotFoundException } from '@nestjs/common';

// Error de dominio para operaciones sobre notificaciones inexistentes.
export class NotificationNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`La notificación con ID ${id} no fue encontrada.`);
  }
}
