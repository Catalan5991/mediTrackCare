import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from '../../application/dtos/create-audit-log.dto';
import { FindAuditLogsDto } from '../../application/dtos/find-audit-logs.dto';
import { CreateAuditLogUseCase } from '../../application/use-cases/create-audit-log.use-case';
import { FindAuditLogByIdUseCase } from '../../application/use-cases/find-audit-log-by-id.use-case';
import { FindAuditLogsUseCase } from '../../application/use-cases/find-audit-logs.use-case';

@Injectable()
export class AuditLogsService {
  constructor(
    private readonly createUseCase: CreateAuditLogUseCase,
    private readonly findAllUseCase: FindAuditLogsUseCase,
    private readonly findByIdUseCase: FindAuditLogByIdUseCase,
  ) {}

  create(dto: CreateAuditLogDto) {
    return this.createUseCase.execute(dto);
  }
  findAll(query: FindAuditLogsDto) {
    return this.findAllUseCase.execute(query);
  }
  findById(id: number) {
    return this.findByIdUseCase.execute(id);
  }
}
