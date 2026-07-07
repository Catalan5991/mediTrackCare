import { BadRequestException } from '@nestjs/common';

// Error de dominio para transiciones de estado no permitidas.
export class NotificationInvalidStateException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
