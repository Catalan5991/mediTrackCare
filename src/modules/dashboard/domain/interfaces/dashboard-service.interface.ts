import { DashboardPeriod } from '../../application/dtos/dashboard-filter.dto';
import { DashboardPeriodRange } from '../entities/admin-dashboard.entity';
import { DashboardAlertEntity } from '../entities/dashboard-alert.entity';
import { PatientDashboardEntity } from '../entities/patient-dashboard.entity';

// Contrato de operaciones puras del dashboard: periodos, porcentajes y alertas.
// Estas reglas quedan separadas de HTTP y de Prisma para poder probarlas facil.
export interface DashboardServiceInterface {
  /**
   * Ejecuta la operación resolve period.
   * @param period Valor de period requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  resolvePeriod(period?: DashboardPeriod): DashboardPeriodRange;
  /**
   * Ejecuta la operación calculate percentage.
   * @param part Valor de part requerido por la operacion.
   * @param total Valor de total requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  calculatePercentage(part: number, total: number): number;
  /**
   * Ejecuta la operación build patient alerts.
   * @param dashboard Valor de dashboard requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  buildPatientAlerts(dashboard: PatientDashboardEntity): DashboardAlertEntity[];
}
