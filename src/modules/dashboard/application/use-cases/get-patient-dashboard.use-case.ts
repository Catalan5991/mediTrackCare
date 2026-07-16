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
  constructor(
    @Inject(DASHBOARD_REPOSITORY)
    private readonly dashboardRepository: DashboardRepository,
    private readonly dashboardService: DashboardService,
  ) {}

  async execute(userId: number, filters: DashboardFilterDto) {
    // Las alertas se construyen despues de obtener las metricas base para que
    // el repositorio no mezcle persistencia con reglas de presentacion.
    const period = this.dashboardService.resolvePeriod(filters.period);
    const dashboard = await this.dashboardRepository.getPatientMetrics(
      userId,
      period,
    );

    return dashboard.withAlerts(this.dashboardService.buildPatientAlerts(dashboard));
  }
}
