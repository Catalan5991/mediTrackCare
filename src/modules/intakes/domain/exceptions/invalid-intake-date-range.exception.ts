import { BadRequestException } from '@nestjs/common';

// Error de negocio para consultas con dateFrom posterior a dateTo.
export class InvalidIntakeDateRangeException extends BadRequestException {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   */
  constructor() {
    super(
      'El rango de fechas no es valido. dateFrom no puede ser mayor que dateTo.',
    );
  }
}
