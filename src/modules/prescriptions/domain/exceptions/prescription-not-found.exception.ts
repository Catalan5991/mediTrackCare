import { NotFoundException } from '@nestjs/common';

// Excepcion de dominio para recetas que no existen.
export class PrescriptionNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`La receta médica con ID ${id} no fue encontrada`);
  }
}
