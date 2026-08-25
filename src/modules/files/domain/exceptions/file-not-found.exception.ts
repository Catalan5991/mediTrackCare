import { NotFoundException } from '@nestjs/common';

export class FileNotFoundException extends NotFoundException {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   */
  constructor(id: number) {
    super(`No se encontro el archivo con ID ${id}.`);
  }
}
