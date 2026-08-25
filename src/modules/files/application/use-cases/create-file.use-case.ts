import { Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from '../dtos/create-file.dto';
import { FileEntity } from '../../domain/entities/file.entity';
import {
  FILES_REPOSITORY,
  IFilesRepository,
} from '../../domain/interfaces/files.repository.interface';
import { FileRelationNotFoundException } from '../../domain/exceptions/file-relation-not-found.exception';

@Injectable()
export class CreateFileUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(FILES_REPOSITORY) private readonly repository: IFilesRepository,
  ) {}
  /**
   * Crea un archivo aplicando las reglas del caso de uso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {FileRelationNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(dto: CreateFileDto): Promise<FileEntity> {
    const missing = await this.repository.findMissingRelation(dto);
    if (missing) throw new FileRelationNotFoundException(missing);
    return this.repository.create({ ...dto });
  }
}
