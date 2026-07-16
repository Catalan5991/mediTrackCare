import { FileEntity } from '../entities/file.entity';

export const FILES_REPOSITORY = 'FILES_REPOSITORY';

export interface CreateFileData {
  patientId?: number | null;
  prescriptionId?: number | null;
  medicationId?: number | null;
  fileName: string;
  fileUrl: string;
  fileType: string;
  description?: string | null;
}

export type UpdateFileData = Partial<CreateFileData>;

export interface FileFilters {
  patientId?: number;
  prescriptionId?: number;
  medicationId?: number;
  fileType?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export interface PaginatedFiles {
  data: FileEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FileRelations {
  patientId?: number | null;
  prescriptionId?: number | null;
  medicationId?: number | null;
}

export interface IFilesRepository {
  create(data: CreateFileData): Promise<FileEntity>;
  findAll(filters: FileFilters): Promise<PaginatedFiles>;
  findById(id: number): Promise<FileEntity | null>;
  update(id: number, data: UpdateFileData): Promise<FileEntity>;
  delete(id: number): Promise<void>;
  findMissingRelation(relations: FileRelations): Promise<string | null>;
}
