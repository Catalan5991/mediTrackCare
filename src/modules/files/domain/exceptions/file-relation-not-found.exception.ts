import { BadRequestException } from '@nestjs/common';

export class FileRelationNotFoundException extends BadRequestException {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param relation Valor de relation requerido por la operacion.
   */
  constructor(relation: string) {
    super(`La relacion indicada no existe: ${relation}.`);
  }
}
