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
  constructor(
    @Inject(FILES_REPOSITORY) private readonly repository: IFilesRepository,
  ) {}
  async execute(id: number, dto: UpdateFileDto): Promise<FileEntity> {
    if (!(await this.repository.findById(id)))
      throw new FileNotFoundException(id);
    const missing = await this.repository.findMissingRelation(dto);
    if (missing) throw new FileRelationNotFoundException(missing);
    return this.repository.update(id, dto);
  }
}
