import { Injectable } from '@nestjs/common';
import { CreateFileDto } from '../../application/dtos/create-file.dto';
import { QueryFilesDto } from '../../application/dtos/query-files.dto';
import { UpdateFileDto } from '../../application/dtos/update-file.dto';
import { CreateFileUseCase } from '../../application/use-cases/create-file.use-case';
import { DeleteFileUseCase } from '../../application/use-cases/delete-file.use-case';
import { FindFileByIdUseCase } from '../../application/use-cases/find-file-by-id.use-case';
import { FindFilesUseCase } from '../../application/use-cases/find-files.use-case';
import { UpdateFileUseCase } from '../../application/use-cases/update-file.use-case';
import { FileEntity } from '../../domain/entities/file.entity';
import { PaginatedFiles } from '../../domain/interfaces/files.repository.interface';

@Injectable()
export class FilesService {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param createUseCase Caso de uso encargado de create use case.
   * @param findAllUseCase Caso de uso encargado de find all use case.
   * @param findByIdUseCase Caso de uso encargado de find by id use case.
   * @param updateUseCase Caso de uso encargado de update use case.
   * @param deleteUseCase Caso de uso encargado de delete use case.
   */
  constructor(
    private readonly createUseCase: CreateFileUseCase,
    private readonly findAllUseCase: FindFilesUseCase,
    private readonly findByIdUseCase: FindFileByIdUseCase,
    private readonly updateUseCase: UpdateFileUseCase,
    private readonly deleteUseCase: DeleteFileUseCase,
  ) {}
  /**
   * Crea un archivo con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(dto: CreateFileDto): Promise<FileEntity> {
    return this.createUseCase.execute(dto);
  }
  /**
   * Obtiene el listado de archivos que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(query: QueryFilesDto): Promise<PaginatedFiles> {
    return this.findAllUseCase.execute(query);
  }
  /**
   * Obtiene un archivo por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<FileEntity> {
    return this.findByIdUseCase.execute(id);
  }
  /**
   * Actualiza un archivo existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, dto: UpdateFileDto): Promise<FileEntity> {
    return this.updateUseCase.execute(id, dto);
  }
  /**
   * Elimina el recurso solicitado.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   */
  delete(id: number): Promise<void> {
    return this.deleteUseCase.execute(id);
  }
}
