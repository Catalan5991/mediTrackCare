import {
  DashboardPeriodRange,
  DailyIntakeEvolution,
} from './admin-dashboard.entity';
import { DashboardAlertEntity } from './dashboard-alert.entity';

// Entidad de lectura personalizada para el paciente autenticado. Todos los datos
// deben pertenecer al paciente resuelto desde el userId del token JWT.
export class PatientDashboardEntity {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param period Valor de period requerido por la operacion.
   * @param patient Valor de patient requerido por la operacion.
   * @param summary Valor de summary requerido por la operacion.
   * @param adherence Valor de adherence requerido por la operacion.
   * @param nextIntakes Valor de next intakes requerido por la operacion.
   * @param currentMedications Valor de current medications requerido por la operacion.
   * @param recentMeasurements Valor de recent measurements requerido por la operacion.
   * @param reminders Valor de reminders requerido por la operacion.
   * @param notifications Valor de notifications requerido por la operacion.
   * @param charts Valor de charts requerido por la operacion.
   * @param alerts Valor de alerts requerido por la operacion.
   */
  constructor(
    public readonly period: DashboardPeriodRange,
    public readonly patient: {
      id: number;
      name: string;
    },
    public readonly summary: {
      activePrescriptions: number;
      currentMedications: number;
      activeReminders: number;
      medicalMeasurements: number;
      unreadNotifications: number;
      nextIntakeAt: Date | null;
      lastMeasurementAt: Date | null;
    },
    public readonly adherence: {
      scheduled: number;
      completed: number;
      pending: number;
      missed: number;
      percentage: number;
      last7DaysPercentage: number;
      last30DaysPercentage: number;
    },
    public readonly nextIntakes: Array<{
      intakeId: number;
      medicationName: string;
      dosage?: string;
      scheduledAt: Date;
      status: string;
    }>,
    public readonly currentMedications: Array<{
      medicationName: string;
      presentation: string;
      concentration: string | null;
      dose: string;
      frequency: string;
      startDate: Date;
      endDate: Date | null;
      prescriptionStatus: string;
    }>,
    public readonly recentMeasurements: Array<{
      id: number;
      measurementType: string;
      value: number;
      secondValue?: number | null;
      unit: string;
      measuredAt: Date;
    }>,
    public readonly reminders: {
      total: number;
      active: number;
      inactive: number;
      upcoming: Array<{
        id: number;
        scheduledTime: string;
        daysOfWeek: string | null;
        isActive: boolean;
      }>;
    },
    public readonly notifications: {
      total: number;
      pending: number;
      unread: number;
      recent: Array<{
        id: number;
        title: string;
        message: string;
        status: string;
        createdAt: Date;
        readAt: Date | null;
      }>;
      latestNotificationAt: Date | null;
    },
    public readonly charts: {
      intakeEvolution: DailyIntakeEvolution[];
      measurementsEvolution: Array<{
        date: string;
        measurementType: string;
        value: number;
        secondValue?: number | null;
        unit: string;
      }>;
    },
    public readonly alerts: DashboardAlertEntity[],
  ) {}
  /**
   * Ejecuta la operación with alerts.
   * @param alerts Valor de alerts requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  withAlerts(alerts: DashboardAlertEntity[]): PatientDashboardEntity {
    // Devuelve una nueva instancia para mantener la entidad inmutable.
    return new PatientDashboardEntity(
      this.period,
      this.patient,
      this.summary,
      this.adherence,
      this.nextIntakes,
      this.currentMedications,
      this.recentMeasurements,
      this.reminders,
      this.notifications,
      this.charts,
      alerts,
    );
  }
}
