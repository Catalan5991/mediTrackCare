import { NotFoundException } from '@nestjs/common';

// Error de negocio para operaciones sobre mediciones inexistentes.
export class MedicalMeasurementNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`La medición médica con ID ${id} no fue encontrada.`);
  }
}
