import { NotFoundException } from '@nestjs/common';

export class AuditLogNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`El registro de auditoría con ID ${id} no fue encontrado.`);
  }
}
