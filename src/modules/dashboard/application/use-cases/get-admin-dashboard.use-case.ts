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
  constructor(
    @Inject(DASHBOARD_REPOSITORY)
    private readonly dashboardRepository: DashboardRepository,
    private readonly dashboardService: DashboardService,
  ) {}

  execute(filters: DashboardFilterDto) {
    // El periodo se resuelve aqui para que el controller no tenga calculos.
    const period = this.dashboardService.resolvePeriod(filters.period);

    return this.dashboardRepository.getAdminMetrics(period);
  }
}
