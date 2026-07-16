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
  constructor(
    private readonly createUseCase: CreateFileUseCase,
    private readonly findAllUseCase: FindFilesUseCase,
    private readonly findByIdUseCase: FindFileByIdUseCase,
    private readonly updateUseCase: UpdateFileUseCase,
    private readonly deleteUseCase: DeleteFileUseCase,
  ) {}
  create(dto: CreateFileDto): Promise<FileEntity> {
    return this.createUseCase.execute(dto);
  }
  findAll(query: QueryFilesDto): Promise<PaginatedFiles> {
    return this.findAllUseCase.execute(query);
  }
  findById(id: number): Promise<FileEntity> {
    return this.findByIdUseCase.execute(id);
  }
  update(id: number, dto: UpdateFileDto): Promise<FileEntity> {
    return this.updateUseCase.execute(id, dto);
  }
  delete(id: number): Promise<void> {
    return this.deleteUseCase.execute(id);
  }
}
