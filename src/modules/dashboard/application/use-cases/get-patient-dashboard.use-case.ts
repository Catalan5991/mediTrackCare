import { Inject, Injectable } from '@nestjs/common';

import { DashboardFilterDto } from '../dtos/dashboard-filter.dto';
import {
  DASHBOARD_REPOSITORY,
  DashboardRepository,
} from '../../domain/interfaces/dashboard.repository';
import { DashboardService } from '../../infrastructure/services/dashboard.service';

@Injectable()
// Caso de uso de lectura para el dashboard del paciente autenticado. Recibe
// userId desde el JWT y no acepta identificadores enviados por el cliente.
export class GetPatientDashboardUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param dashboardRepository Repositorio utilizado para persistir y consultar dashboard repository.
   * @param dashboardService Servicio que coordina las operaciones de dashboard service.
   */
  constructor(
    @Inject(DASHBOARD_REPOSITORY)
    private readonly dashboardRepository: DashboardRepository,
    private readonly dashboardService: DashboardService,
  ) {}
  /**
   * Obtiene informacion de panel segun los criterios indicados.
   * @param userId Valor de user id requerido por la operacion.
   * @param filters Datos de filters validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async execute(userId: number, filters: DashboardFilterDto) {
    // Las alertas se construyen despues de obtener las metricas base para que
    // el repositorio no mezcle persistencia con reglas de presentacion.
    const period = this.dashboardService.resolvePeriod(filters.period);
    const dashboard = await this.dashboardRepository.getPatientMetrics(
      userId,
      period,
    );

    return dashboard.withAlerts(
      this.dashboardService.buildPatientAlerts(dashboard),
    );
  }
}
