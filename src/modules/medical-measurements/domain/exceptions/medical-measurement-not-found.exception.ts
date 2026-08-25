import { NotFoundException } from '@nestjs/common';

// Error de negocio para operaciones sobre mediciones inexistentes.
export class MedicalMeasurementNotFoundException extends NotFoundException {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   */
  constructor(id: number) {
    super(`La medición médica con ID ${id} no fue encontrada.`);
  }
}
