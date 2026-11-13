// Error de dominio reservado para denegaciones propias del Dashboard. El guard
// maneja la mayoria de casos por rol, pero este permite reglas futuras.
export class DashboardAccessDeniedException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param message Valor de message requerido por la operacion.
   */
  constructor(message = 'No tienes permisos para consultar este dashboard.') {
    super(message);
    this.name = 'DashboardAccessDeniedException';
  }
}
