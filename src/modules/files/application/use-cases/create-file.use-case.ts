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
  constructor(
    @Inject(FILES_REPOSITORY) private readonly repository: IFilesRepository,
  ) {}

  async execute(dto: CreateFileDto): Promise<FileEntity> {
    const missing = await this.repository.findMissingRelation(dto);
    if (missing) throw new FileRelationNotFoundException(missing);
    return this.repository.create({ ...dto });
  }
}
