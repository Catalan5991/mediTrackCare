import { Inject, Injectable } from '@nestjs/common';
import { FileEntity } from '../../domain/entities/file.entity';
import { FileNotFoundException } from '../../domain/exceptions/file-not-found.exception';
import {
  FILES_REPOSITORY,
  IFilesRepository,
} from '../../domain/interfaces/files.repository.interface';

@Injectable()
export class FindFileByIdUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(FILES_REPOSITORY) private readonly repository: IFilesRepository,
  ) {}
  /**
   * Obtiene informacion de archivo segun los criterios indicados.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {FileNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<FileEntity> {
    const file = await this.repository.findById(id);
    if (!file) throw new FileNotFoundException(id);
    return file;
  }
}
