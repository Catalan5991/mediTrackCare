import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import {
  AuditLogFilters,
  CreateAuditLogData,
  IAuditLogsRepository,
  PaginatedAuditLogs,
} from '../../domain/interfaces/audit-logs.repository.interface';
import { AuditLogMapper } from '../mappers/audit-log.mapper';

@Injectable()
export class PrismaAuditLogsRepository implements IAuditLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAuditLogData): Promise<AuditLogEntity> {
    return AuditLogMapper.toEntity(
      await this.prisma.auditLog.create({
        data: AuditLogMapper.toPrismaCreate(data),
      }),
    );
  }

  async findAll(filters: AuditLogFilters): Promise<PaginatedAuditLogs> {
    const page = Math.max(Number(filters.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(filters.limit ?? 10), 1), 100);
    const where: Prisma.AuditLogWhereInput = {};
    if (filters.userId !== undefined) where.userId = filters.userId;
    if (filters.module)
      where.module = { equals: filters.module, mode: 'insensitive' };
    if (filters.action)
      where.action = { equals: filters.action, mode: 'insensitive' };
    if (filters.entityName)
      where.entityName = { equals: filters.entityName, mode: 'insensitive' };
    if (filters.entityId !== undefined) where.entityId = filters.entityId;
    if (filters.search) {
      where.OR = [
        { module: { contains: filters.search, mode: 'insensitive' } },
        { action: { contains: filters.search, mode: 'insensitive' } },
        { entityName: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.dateFrom || filters.dateTo)
      where.createdAt = { gte: filters.dateFrom, lte: filters.dateTo };

    const [logs, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);
    return {
      data: logs.map(AuditLogMapper.toEntity),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<AuditLogEntity | null> {
    const log = await this.prisma.auditLog.findUnique({ where: { id } });
    return log ? AuditLogMapper.toEntity(log) : null;
  }
}
