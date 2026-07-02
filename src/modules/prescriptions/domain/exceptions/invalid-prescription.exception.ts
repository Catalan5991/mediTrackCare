import { BadRequestException } from '@nestjs/common';

// Excepcion de dominio para reglas de negocio invalidas en recetas.
export class InvalidPrescriptionException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
