import { DashboardPeriod } from '../../application/dtos/dashboard-filter.dto';

// Rango temporal resuelto a fechas UTC usado por todas las metricas del modulo.
export interface DashboardPeriodRange {
  value: DashboardPeriod;
  startDate: Date;
  endDate: Date;
}

export interface DailyIntakeEvolution {
  date: string;
  completed: number;
  missed: number;
}

export interface DailyUserRegistration {
  date: string;
  total: number;
}

// Entidad de lectura para el dashboard administrativo. Agrupa metricas globales
// sin incluir datos sensibles como contrasenas o informacion clinica detallada.
export class AdminDashboardEntity {
  constructor(
    public readonly period: DashboardPeriodRange,
    public readonly users: {
      total: number;
      active: number;
      inactive: number;
      patients: number;
      doctors: number;
      caregivers: number;
      byRole: Array<{ role: string; total: number }>;
      recentlyRegistered: number;
    },
    public readonly patients: {
      total: number;
      withActivePrescriptions: number;
    },
    public readonly prescriptions: {
      total: number;
      active: number;
      expired: number;
      averageMedicationsPerPrescription: number;
      mostPrescribedMedications: Array<{
        medicationId: number;
        medicationName: string;
        total: number;
      }>;
    },
    public readonly intakes: {
      total: number;
      completed: number;
      pending: number;
      missed: number;
      delayed: number;
      adherencePercentage: number;
      patientsWithLowAdherence: Array<{
        patientId: number;
        patientName: string;
        adherencePercentage: number;
      }>;
    },
    public readonly reminders: {
      total: number;
      active: number;
      inactive: number;
    },
    public readonly notifications: {
      total: number;
      pending: number;
      sent: number;
      read: number;
      unread: number;
      readPercentage: number;
    },
    public readonly medicalMeasurements: {
      total: number;
      recentlyRegistered: number;
      byType: Array<{ type: string; total: number }>;
      patientsRecentlyMeasured: number;
    },
    public readonly files: {
      total: number;
      recentlyUploaded: number;
    },
    public readonly audit: {
      total: number;
      recentActivities: Array<{
        id: number;
        module: string;
        action: string;
        entityName: string;
        createdAt: Date;
      }>;
      byModule: Array<{ module: string; total: number }>;
    },
    public readonly charts: {
      adherenceEvolution: DailyIntakeEvolution[];
      userRegistrations: DailyUserRegistration[];
    },
  ) {}
}
