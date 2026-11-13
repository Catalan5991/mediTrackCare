import { AuditLog, Prisma } from '../../../../../generated/prisma/client';
import { AuditLogResponseDto } from '../../application/dtos/audit-log-response.dto';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import { CreateAuditLogData } from '../../domain/interfaces/audit-logs.repository.interface';

export class AuditLogMapper {
  /**
   * Ejecuta la operación to entity.
   * @param log Valor de log requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
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
  /**
   * Ejecuta la operación to prisma create.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
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
  /**
   * Transforma el recurso solicitado.
   * @param entity Valor de entity requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  static toResponse(entity: AuditLogEntity): AuditLogResponseDto {
    return { ...entity };
  }
}
