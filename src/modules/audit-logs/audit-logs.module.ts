import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditLogUseCase } from './application/use-cases/create-audit-log.use-case';
import { FindAuditLogByIdUseCase } from './application/use-cases/find-audit-log-by-id.use-case';
import { FindAuditLogsUseCase } from './application/use-cases/find-audit-logs.use-case';
import { AUDIT_LOGS_REPOSITORY } from './domain/interfaces/audit-logs.repository.interface';
import { AuditLogsController } from './infrastructure/controllers/audit-logs.controller';
import { PrismaAuditLogsRepository } from './infrastructure/repositories/prisma-audit-logs.repository';
import { AuditLogsService } from './infrastructure/services/audit-logs.service';

@Module({
  controllers: [AuditLogsController],
  providers: [
    PrismaService,
    AuditLogsService,
    CreateAuditLogUseCase,
    FindAuditLogsUseCase,
    FindAuditLogByIdUseCase,
    { provide: AUDIT_LOGS_REPOSITORY, useClass: PrismaAuditLogsRepository },
  ],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
