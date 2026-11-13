export type DashboardAlertType =
  | 'UPCOMING_INTAKE'
  | 'MISSED_INTAKES'
  | 'LOW_ADHERENCE'
  | 'PRESCRIPTION_ENDING_SOON'
  | 'NO_RECENT_MEASUREMENTS'
  | 'UNREAD_NOTIFICATIONS';

export type DashboardAlertSeverity = 'INFO' | 'WARNING';

// Alerta informativa para el dashboard del paciente. No representa diagnostico
// medico; solo comunica situaciones operativas detectadas por la API.
export class DashboardAlertEntity {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param type Valor de type requerido por la operacion.
   * @param severity Valor de severity requerido por la operacion.
   * @param title Valor de title requerido por la operacion.
   * @param message Valor de message requerido por la operacion.
   */
  constructor(
    public readonly type: DashboardAlertType,
    public readonly severity: DashboardAlertSeverity,
    public readonly title: string,
    public readonly message: string,
  ) {}
}
