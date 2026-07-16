import { Inject, Injectable } from '@nestjs/common';
import { FileNotFoundException } from '../../domain/exceptions/file-not-found.exception';
import {
  FILES_REPOSITORY,
  IFilesRepository,
} from '../../domain/interfaces/files.repository.interface';

@Injectable()
export class DeleteFileUseCase {
  constructor(
    @Inject(FILES_REPOSITORY) private readonly repository: IFilesRepository,
  ) {}
  async execute(id: number): Promise<void> {
    if (!(await this.repository.findById(id)))
      throw new FileNotFoundException(id);
    await this.repository.delete(id);
  }
}
