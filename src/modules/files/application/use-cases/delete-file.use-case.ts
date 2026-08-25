import { Inject, Injectable } from '@nestjs/common';
import { FileNotFoundException } from '../../domain/exceptions/file-not-found.exception';
import {
  FILES_REPOSITORY,
  IFilesRepository,
} from '../../domain/interfaces/files.repository.interface';

@Injectable()
export class DeleteFileUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(FILES_REPOSITORY) private readonly repository: IFilesRepository,
  ) {}
  /**
   * Elimina un archivo aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   * @throws {FileNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<void> {
    if (!(await this.repository.findById(id)))
      throw new FileNotFoundException(id);
    await this.repository.delete(id);
  }
}
