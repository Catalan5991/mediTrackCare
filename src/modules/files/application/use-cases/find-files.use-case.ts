import { Inject, Injectable } from '@nestjs/common';
import { QueryFilesDto } from '../dtos/query-files.dto';
import {
  FILES_REPOSITORY,
  IFilesRepository,
  PaginatedFiles,
} from '../../domain/interfaces/files.repository.interface';

@Injectable()
export class FindFilesUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(FILES_REPOSITORY) private readonly repository: IFilesRepository,
  ) {}
  /**
   * Obtiene informacion de archivo segun los criterios indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  execute(query: QueryFilesDto): Promise<PaginatedFiles> {
    return this.repository.findAll({
      ...query,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    });
  }
}
