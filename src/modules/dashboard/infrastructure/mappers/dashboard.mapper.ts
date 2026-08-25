import { AdminDashboardResponseDto } from '../../application/dtos/admin-dashboard-response.dto';
import { PatientDashboardResponseDto } from '../../application/dtos/patient-dashboard-response.dto';
import { AdminDashboardEntity } from '../../domain/entities/admin-dashboard.entity';
import { PatientDashboardEntity } from '../../domain/entities/patient-dashboard.entity';

// Mapper de salida del modulo. Mantiene aislada la forma HTTP aun cuando hoy
// las entidades ya coinciden con los DTOs de respuesta documentados en Swagger.
export class DashboardMapper {
  /**
   * Ejecuta la operación to admin response.
   * @param dashboard Valor de dashboard requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  static toAdminResponse(
    dashboard: AdminDashboardEntity,
  ): AdminDashboardResponseDto {
    return dashboard;
  }
  /**
   * Ejecuta la operación to patient response.
   * @param dashboard Valor de dashboard requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  static toPatientResponse(
    dashboard: PatientDashboardEntity,
  ): PatientDashboardResponseDto {
    return dashboard;
  }
}
