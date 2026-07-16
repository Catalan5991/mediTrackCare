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
  create(data: CreateAuditLogData): Promise<AuditLogEntity>;
  findAll(filters: AuditLogFilters): Promise<PaginatedAuditLogs>;
  findById(id: number): Promise<AuditLogEntity | null>;
}
