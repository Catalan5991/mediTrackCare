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
  /**
   * Crea un archivo con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  create(data: CreateFileData): Promise<FileEntity>;
  /**
   * Obtiene el listado de archivos que cumplen los filtros indicados.
   * @param filters Valor de filters requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(filters: FileFilters): Promise<PaginatedFiles>;
  /**
   * Obtiene un archivo por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<FileEntity | null>;
  /**
   * Actualiza un archivo existente.
   * @param id Identificador único del recurso.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, data: UpdateFileData): Promise<FileEntity>;
  /**
   * Obtiene missing relation.
   * @param relations Valor de relations requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findMissingRelation(relations: FileRelations): Promise<string | null>;

  /**
   * Elimina un archivo por su identificador.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   */
  delete(id: number): Promise<void>;
}
