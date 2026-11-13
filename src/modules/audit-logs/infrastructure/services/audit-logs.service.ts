import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from '../../application/dtos/create-audit-log.dto';
import { FindAuditLogsDto } from '../../application/dtos/find-audit-logs.dto';
import { CreateAuditLogUseCase } from '../../application/use-cases/create-audit-log.use-case';
import { FindAuditLogByIdUseCase } from '../../application/use-cases/find-audit-log-by-id.use-case';
import { FindAuditLogsUseCase } from '../../application/use-cases/find-audit-logs.use-case';

@Injectable()
export class AuditLogsService {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param createUseCase Caso de uso encargado de create use case.
   * @param findAllUseCase Caso de uso encargado de find all use case.
   * @param findByIdUseCase Caso de uso encargado de find by id use case.
   */
  constructor(
    private readonly createUseCase: CreateAuditLogUseCase,
    private readonly findAllUseCase: FindAuditLogsUseCase,
    private readonly findByIdUseCase: FindAuditLogByIdUseCase,
  ) {}
  /**
   * Crea un registro de auditoria con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(dto: CreateAuditLogDto) {
    return this.createUseCase.execute(dto);
  }
  /**
   * Obtiene el listado de registro de auditorias que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(query: FindAuditLogsDto) {
    return this.findAllUseCase.execute(query);
  }
  /**
   * Obtiene un registro de auditoria por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number) {
    return this.findByIdUseCase.execute(id);
  }
}
