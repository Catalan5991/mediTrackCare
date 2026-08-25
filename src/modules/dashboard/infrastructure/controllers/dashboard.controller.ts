import {
  Controller,
  Get,
  Query,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { CurrentUser as AuthenticatedUser } from '../../../../common/decorators/current-user.decorator';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Permission } from '../../../../common/enums/permission.enum';
import { SystemRole } from '../../../../common/enums/system-role.enum';
import { AdminDashboardResponseDto } from '../../application/dtos/admin-dashboard-response.dto';
import {
  DashboardFilterDto,
  DashboardPeriod,
} from '../../application/dtos/dashboard-filter.dto';
import { PatientDashboardResponseDto } from '../../application/dtos/patient-dashboard-response.dto';
import { GetAdminDashboardUseCase } from '../../application/use-cases/get-admin-dashboard.use-case';
import { GetPatientDashboardUseCase } from '../../application/use-cases/get-patient-dashboard.use-case';
import { DashboardMapper } from '../mappers/dashboard.mapper';
import { DashboardExceptionFilter } from '../filters/dashboard-exception.filter';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseFilters(DashboardExceptionFilter)
// Controller HTTP del modulo Dashboard. Solo valida entrada, toma el usuario
// autenticado cuando aplica y delega la obtencion de metricas a casos de uso.
export class DashboardController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param getAdminDashboardUseCase Caso de uso encargado de get admin dashboard use case.
   * @param getPatientDashboardUseCase Caso de uso encargado de get patient dashboard use case.
   */
  constructor(
    private readonly getAdminDashboardUseCase: GetAdminDashboardUseCase,
    private readonly getPatientDashboardUseCase: GetPatientDashboardUseCase,
  ) {}
  /**
   * Obtiene admin dashboard.
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Get('admin')
  @Permissions(Permission.VIEW_GENERAL_DASHBOARD)
  @ApiOperation({
    summary: 'Obtener dashboard administrativo',
    description:
      'Devuelve metricas globales de usuarios, pacientes, recetas, tomas, recordatorios, notificaciones, mediciones, archivos y auditoria.',
  })
  @ApiQuery({
    name: 'period',
    enum: DashboardPeriod,
    required: false,
    example: DashboardPeriod.THIRTY_DAYS,
  })
  @ApiOkResponse({
    description: 'Dashboard administrativo obtenido correctamente.',
    type: AdminDashboardResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no tiene rol de administrador.',
  })
  // GET /dashboard/admin expone metricas globales y queda restringido a ADMIN.
  getAdminDashboard(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    filters: DashboardFilterDto,
  ) {
    return this.getAdminDashboardUseCase
      .execute(filters)
      .then(DashboardMapper.toAdminResponse);
  }
  /**
   * Obtiene patient dashboard.
   * @param user Valor de user requerido por la operacion.
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Get('patient/me')
  @Roles(SystemRole.PATIENT)
  @ApiOperation({
    summary: 'Obtener dashboard del paciente autenticado',
    description:
      'Devuelve metricas, proximas tomas, mediciones, notificaciones y alertas del paciente asociado al usuario autenticado.',
  })
  @ApiQuery({
    name: 'period',
    enum: DashboardPeriod,
    required: false,
    example: DashboardPeriod.THIRTY_DAYS,
  })
  @ApiOkResponse({
    description: 'Dashboard del paciente obtenido correctamente.',
    type: PatientDashboardResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no tiene rol de paciente.',
  })
  @ApiNotFoundResponse({
    description: 'No existe un perfil de paciente relacionado al usuario.',
  })
  // GET /dashboard/patient/me nunca recibe patientId desde el cliente; usa el
  // user.id del JWT para resolver internamente el perfil de paciente asociado.
  getPatientDashboard(
    @CurrentUser() user: AuthenticatedUser,
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    filters: DashboardFilterDto,
  ) {
    return this.getPatientDashboardUseCase
      .execute(user.id, filters)
      .then(DashboardMapper.toPatientResponse);
  }
}
