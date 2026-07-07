import { NotFoundException } from '@nestjs/common';

// Error de negocio para operaciones sobre tomas inexistentes.
export class IntakeNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`La toma con ID ${id} no fue encontrada.`);
  }
}
