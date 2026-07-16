import { Inject, Injectable } from '@nestjs/common';
import { FindAuditLogsDto } from '../dtos/find-audit-logs.dto';
import {
  AUDIT_LOGS_REPOSITORY,
  IAuditLogsRepository,
  PaginatedAuditLogs,
} from '../../domain/interfaces/audit-logs.repository.interface';

@Injectable()
export class FindAuditLogsUseCase {
  constructor(
    @Inject(AUDIT_LOGS_REPOSITORY)
    private readonly repository: IAuditLogsRepository,
  ) {}

  execute(query: FindAuditLogsDto): Promise<PaginatedAuditLogs> {
    return this.repository.findAll({
      ...query,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    });
  }
}
