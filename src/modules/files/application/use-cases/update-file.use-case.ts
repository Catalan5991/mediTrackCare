import { Inject, Injectable } from '@nestjs/common';
import { UpdateFileDto } from '../dtos/update-file.dto';
import { FileEntity } from '../../domain/entities/file.entity';
import { FileNotFoundException } from '../../domain/exceptions/file-not-found.exception';
import { FileRelationNotFoundException } from '../../domain/exceptions/file-relation-not-found.exception';
import {
  FILES_REPOSITORY,
  IFilesRepository,
} from '../../domain/interfaces/files.repository.interface';

@Injectable()
export class UpdateFileUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(FILES_REPOSITORY) private readonly repository: IFilesRepository,
  ) {}
  /**
   * Actualiza un archivo aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {FileNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   * @throws {FileRelationNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number, dto: UpdateFileDto): Promise<FileEntity> {
    if (!(await this.repository.findById(id)))
      throw new FileNotFoundException(id);
    const missing = await this.repository.findMissingRelation(dto);
    if (missing) throw new FileRelationNotFoundException(missing);
    return this.repository.update(id, dto);
  }
}
