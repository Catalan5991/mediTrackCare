import { DashboardPeriod } from '../../application/dtos/dashboard-filter.dto';
import { DashboardPeriodRange } from '../entities/admin-dashboard.entity';
import { DashboardAlertEntity } from '../entities/dashboard-alert.entity';
import { PatientDashboardEntity } from '../entities/patient-dashboard.entity';

// Contrato de operaciones puras del dashboard: periodos, porcentajes y alertas.
// Estas reglas quedan separadas de HTTP y de Prisma para poder probarlas facil.
export interface DashboardServiceInterface {
  resolvePeriod(period?: DashboardPeriod): DashboardPeriodRange;
  calculatePercentage(part: number, total: number): number;
  buildPatientAlerts(dashboard: PatientDashboardEntity): DashboardAlertEntity[];
}
