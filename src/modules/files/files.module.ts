import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFileUseCase } from './application/use-cases/create-file.use-case';
import { DeleteFileUseCase } from './application/use-cases/delete-file.use-case';
import { FindFileByIdUseCase } from './application/use-cases/find-file-by-id.use-case';
import { FindFilesUseCase } from './application/use-cases/find-files.use-case';
import { UpdateFileUseCase } from './application/use-cases/update-file.use-case';
import { FILES_REPOSITORY } from './domain/interfaces/files.repository.interface';
import { FilesController } from './infrastructure/controllers/files.controller';
import { PrismaFilesRepository } from './infrastructure/repositories/prisma-files.repository';
import { FilesService } from './infrastructure/services/files.service';

@Module({
  controllers: [FilesController],
  providers: [
    PrismaService,
    FilesService,
    CreateFileUseCase,
    FindFilesUseCase,
    FindFileByIdUseCase,
    UpdateFileUseCase,
    DeleteFileUseCase,
    { provide: FILES_REPOSITORY, useClass: PrismaFilesRepository },
  ],
  exports: [FilesService],
})
export class FilesModule {}
