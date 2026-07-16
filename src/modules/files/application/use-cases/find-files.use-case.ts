import { Inject, Injectable } from '@nestjs/common';
import { QueryFilesDto } from '../dtos/query-files.dto';
import {
  FILES_REPOSITORY,
  IFilesRepository,
  PaginatedFiles,
} from '../../domain/interfaces/files.repository.interface';

@Injectable()
export class FindFilesUseCase {
  constructor(
    @Inject(FILES_REPOSITORY) private readonly repository: IFilesRepository,
  ) {}
  execute(query: QueryFilesDto): Promise<PaginatedFiles> {
    return this.repository.findAll({
      ...query,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    });
  }
}
