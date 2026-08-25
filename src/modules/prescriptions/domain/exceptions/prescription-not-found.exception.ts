import { NotFoundException } from '@nestjs/common';

// Excepcion de dominio para recetas que no existen.
export class PrescriptionNotFoundException extends NotFoundException {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   */
  constructor(id: number) {
    super(`La receta médica con ID ${id} no fue encontrada`);
  }
}
