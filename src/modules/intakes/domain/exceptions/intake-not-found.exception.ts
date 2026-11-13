import { NotFoundException } from '@nestjs/common';

// Error de negocio para operaciones sobre tomas inexistentes.
export class IntakeNotFoundException extends NotFoundException {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   */
  constructor(id: number) {
    super(`La toma con ID ${id} no fue encontrada.`);
  }
}
