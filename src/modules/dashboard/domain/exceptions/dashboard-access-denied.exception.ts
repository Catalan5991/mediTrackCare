// Error de dominio reservado para denegaciones propias del Dashboard. El guard
// maneja la mayoria de casos por rol, pero este permite reglas futuras.
export class DashboardAccessDeniedException extends Error {
  constructor(message = 'No tienes permisos para consultar este dashboard.') {
    super(message);
    this.name = 'DashboardAccessDeniedException';
  }
}
