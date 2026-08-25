import { Inject, Injectable } from '@nestjs/common';

import { DashboardFilterDto } from '../dtos/dashboard-filter.dto';
import {
  DASHBOARD_REPOSITORY,
  DashboardRepository,
} from '../../domain/interfaces/dashboard.repository';
import { DashboardService } from '../../infrastructure/services/dashboard.service';

@Injectable()
// Caso de uso de lectura para el dashboard administrativo. Normaliza el periodo
// solicitado y delega al repositorio la recoleccion eficiente de metricas.
export class GetAdminDashboardUseCase {
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
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  execute(filters: DashboardFilterDto) {
    // El periodo se resuelve aqui para que el controller no tenga calculos.
    const period = this.dashboardService.resolvePeriod(filters.period);

    return this.dashboardRepository.getAdminMetrics(period);
  }
}
