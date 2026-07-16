import { Inject, Injectable } from '@nestjs/common';
import { FileEntity } from '../../domain/entities/file.entity';
import { FileNotFoundException } from '../../domain/exceptions/file-not-found.exception';
import {
  FILES_REPOSITORY,
  IFilesRepository,
} from '../../domain/interfaces/files.repository.interface';

@Injectable()
export class FindFileByIdUseCase {
  constructor(
    @Inject(FILES_REPOSITORY) private readonly repository: IFilesRepository,
  ) {}
  async execute(id: number): Promise<FileEntity> {
    const file = await this.repository.findById(id);
    if (!file) throw new FileNotFoundException(id);
    return file;
  }
}
