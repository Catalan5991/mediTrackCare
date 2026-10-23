import { PatientsModule } from '../patients/patients.module';
import { GetCaregiverDashboardUseCase } from './application/use-cases/get-caregiver-dashboard.use-case';
import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { GetAdminDashboardUseCase } from './application/use-cases/get-admin-dashboard.use-case';
import { GetPatientDashboardUseCase } from './application/use-cases/get-patient-dashboard.use-case';
import { DASHBOARD_REPOSITORY } from './domain/interfaces/dashboard.repository';
import { DashboardController } from './infrastructure/controllers/dashboard.controller';
import { PrismaDashboardRepository } from './infrastructure/repositories/prisma-dashboard.repository';
import { DashboardService } from './infrastructure/services/dashboard.service';

// Modulo raiz del dashboard. Agrupa el controller HTTP, los casos de uso,
// el servicio de calculos y el adaptador Prisma que implementa el repositorio.
@Module({
  imports: [PrismaModule, PatientsModule],
  controllers: [DashboardController],
  providers: [
    GetCaregiverDashboardUseCase,
    DashboardService,
    GetAdminDashboardUseCase,
    GetPatientDashboardUseCase,
    {
      provide: DASHBOARD_REPOSITORY,
      useClass: PrismaDashboardRepository,
    },
  ],
})
export class DashboardModule {}
