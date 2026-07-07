import { NotFoundException } from '@nestjs/common';

// Error de negocio para operaciones sobre recordatorios inexistentes.
export class ReminderNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`El recordatorio con ID ${id} no fue encontrado.`);
  }
}
