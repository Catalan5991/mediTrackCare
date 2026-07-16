import { Inject, Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from '../dtos/create-audit-log.dto';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import {
  AUDIT_LOGS_REPOSITORY,
  IAuditLogsRepository,
} from '../../domain/interfaces/audit-logs.repository.interface';

@Injectable()
export class CreateAuditLogUseCase {
  constructor(
    @Inject(AUDIT_LOGS_REPOSITORY)
    private readonly repository: IAuditLogsRepository,
  ) {}

  execute(dto: CreateAuditLogDto): Promise<AuditLogEntity> {
    return this.repository.create({
      userId: dto.userId ?? null,
      module: dto.module,
      action: dto.action,
      entityName: dto.entityName,
      entityId: dto.entityId ?? null,
      description: dto.description ?? null,
    });
  }
}
