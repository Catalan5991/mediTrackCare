import { Inject, Injectable } from '@nestjs/common';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import { AuditLogNotFoundException } from '../../domain/exceptions/audit-log-not-found.exception';
import {
  AUDIT_LOGS_REPOSITORY,
  IAuditLogsRepository,
} from '../../domain/interfaces/audit-logs.repository.interface';

@Injectable()
export class FindAuditLogByIdUseCase {
  constructor(
    @Inject(AUDIT_LOGS_REPOSITORY)
    private readonly repository: IAuditLogsRepository,
  ) {}

  async execute(id: number): Promise<AuditLogEntity> {
    const log = await this.repository.findById(id);
    if (!log) throw new AuditLogNotFoundException(id);
    return log;
  }
}
