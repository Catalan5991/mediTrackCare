import { AuditLogEntity } from '../entities/audit-log.entity';

export const AUDIT_LOGS_REPOSITORY = 'AUDIT_LOGS_REPOSITORY';

export interface CreateAuditLogData {
  userId?: number | null;
  module: string;
  action: string;
  entityName: string;
  entityId?: number | null;
  description?: string | null;
}

export interface AuditLogFilters {
  userId?: number;
  module?: string;
  action?: string;
  entityName?: string;
  entityId?: number;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export interface PaginatedAuditLogs {
  data: AuditLogEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IAuditLogsRepository {
  /**
   * Crea un registro de auditoria con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  create(data: CreateAuditLogData): Promise<AuditLogEntity>;
  /**
   * Obtiene el listado de registro de auditorias que cumplen los filtros indicados.
   * @param filters Valor de filters requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(filters: AuditLogFilters): Promise<PaginatedAuditLogs>;
  /**
   * Obtiene un registro de auditoria por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<AuditLogEntity | null>;
}
