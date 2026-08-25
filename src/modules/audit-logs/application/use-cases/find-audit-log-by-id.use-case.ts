import { Inject, Injectable } from '@nestjs/common';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import { AuditLogNotFoundException } from '../../domain/exceptions/audit-log-not-found.exception';
import {
  AUDIT_LOGS_REPOSITORY,
  IAuditLogsRepository,
} from '../../domain/interfaces/audit-logs.repository.interface';

@Injectable()
export class FindAuditLogByIdUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(AUDIT_LOGS_REPOSITORY)
    private readonly repository: IAuditLogsRepository,
  ) {}
  /**
   * Obtiene registros de auditoria segun los criterios indicados.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {AuditLogNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<AuditLogEntity> {
    const log = await this.repository.findById(id);
    if (!log) throw new AuditLogNotFoundException(id);
    return log;
  }
}
