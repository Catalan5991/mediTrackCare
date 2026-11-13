import { BadRequestException } from '@nestjs/common';

// Excepcion de dominio para reglas de negocio invalidas en recetas.
export class InvalidPrescriptionException extends BadRequestException {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param message Valor de message requerido por la operacion.
   */
  constructor(message: string) {
    super(message);
  }
}
