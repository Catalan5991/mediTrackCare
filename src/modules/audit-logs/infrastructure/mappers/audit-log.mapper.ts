import { AuditLog, Prisma } from '../../../../../generated/prisma/client';
import { AuditLogResponseDto } from '../../application/dtos/audit-log-response.dto';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import { CreateAuditLogData } from '../../domain/interfaces/audit-logs.repository.interface';

export class AuditLogMapper {
  static toEntity(log: AuditLog): AuditLogEntity {
    return new AuditLogEntity(
      log.id,
      log.userId,
      log.module,
      log.action,
      log.entityName,
      log.entityId,
      log.description,
      log.createdAt,
    );
  }

  static toPrismaCreate(
    data: CreateAuditLogData,
  ): Prisma.AuditLogUncheckedCreateInput {
    return {
      ...data,
      userId: data.userId ?? null,
      entityId: data.entityId ?? null,
      description: data.description ?? null,
    };
  }

  static toResponse(entity: AuditLogEntity): AuditLogResponseDto {
    return { ...entity };
  }
}
