import { BadRequestException } from '@nestjs/common';

// Error de dominio para transiciones de estado no permitidas.
export class NotificationInvalidStateException extends BadRequestException {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param message Valor de message requerido por la operacion.
   */
  constructor(message: string) {
    super(message);
  }
}
