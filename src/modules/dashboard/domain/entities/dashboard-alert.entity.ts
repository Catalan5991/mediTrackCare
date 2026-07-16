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
  constructor(
    public readonly type: DashboardAlertType,
    public readonly severity: DashboardAlertSeverity,
    public readonly title: string,
    public readonly message: string,
  ) {}
}
