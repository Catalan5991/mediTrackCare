import { Inject, Injectable } from '@nestjs/common';
import { FindAuditLogsDto } from '../dtos/find-audit-logs.dto';
import {
  AUDIT_LOGS_REPOSITORY,
  IAuditLogsRepository,
  PaginatedAuditLogs,
} from '../../domain/interfaces/audit-logs.repository.interface';

@Injectable()
export class FindAuditLogsUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(AUDIT_LOGS_REPOSITORY)
    private readonly repository: IAuditLogsRepository,
  ) {}
  /**
   * Obtiene registros de auditoria segun los criterios indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  execute(query: FindAuditLogsDto): Promise<PaginatedAuditLogs> {
    return this.repository.findAll({
      ...query,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    });
  }
}
