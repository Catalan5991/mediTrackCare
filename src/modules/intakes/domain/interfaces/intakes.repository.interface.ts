import { CreateIntakeDto } from '../../application/dtos/create-intake.dto';
import { FindIntakesDto } from '../../application/dtos/find-intakes.dto';
import { UpdateIntakeDto } from '../../application/dtos/update-intake.dto';
import { IntakeEntity } from '../entities/intake.entity';

export const INTAKES_REPOSITORY = 'INTAKES_REPOSITORY';

// Forma comun de respuesta para listados paginados de tomas.
export interface IntakesPaginatedResponse {
  data: IntakeEntity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

// Contrato que desacopla los casos de uso de la implementacion con Prisma.
export interface IntakesRepository {
  /**
   * Crea un toma con los datos recibidos.
   * @param data Datos de data validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(data: CreateIntakeDto): Promise<IntakeEntity>;
  /**
   * Obtiene el listado de tomas que cumplen los filtros indicados.
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(filters: FindIntakesDto): Promise<IntakesPaginatedResponse>;
  /**
   * Obtiene un toma por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<IntakeEntity | null>;
  /**
   * Actualiza un toma existente.
   * @param id Identificador único del recurso.
   * @param data Datos de data validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, data: UpdateIntakeDto): Promise<IntakeEntity>;

  /**
   * Elimina el recurso solicitado.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   */
  delete(id: number): Promise<void>;
}
