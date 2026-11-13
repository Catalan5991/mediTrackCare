import { NotFoundException } from '@nestjs/common';

export class AuditLogNotFoundException extends NotFoundException {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   */
  constructor(id: number) {
    super(`El registro de auditoría con ID ${id} no fue encontrado.`);
  }
}
