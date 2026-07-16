import { DashboardPeriodRange } from '../entities/admin-dashboard.entity';
import { AdminDashboardEntity } from '../entities/admin-dashboard.entity';
import { PatientDashboardEntity } from '../entities/patient-dashboard.entity';

export const DASHBOARD_REPOSITORY = Symbol('DASHBOARD_REPOSITORY');

// Puerto de persistencia del Dashboard. Los casos de uso dependen de este
// contrato y no de Prisma, manteniendo la frontera de Clean Architecture.
export interface DashboardRepository {
  getAdminMetrics(period: DashboardPeriodRange): Promise<AdminDashboardEntity>;

  getPatientMetrics(
    userId: number,
    period: DashboardPeriodRange,
  ): Promise<PatientDashboardEntity>;
}
