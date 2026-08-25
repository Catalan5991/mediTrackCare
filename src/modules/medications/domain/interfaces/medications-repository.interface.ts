import { MedicationEntity } from '../entities/medication.entity';

// Filtros permitidos al consultar el catalogo de medicamentos.
export interface FindAllMedicationsParams {
  search?: string;
  isActive?: boolean;
}

// Puerto de persistencia consumido por la aplicacion sin conocer Prisma.
export abstract class MedicationsRepository {
  /**
   * Crea un medicamento con los datos recibidos.
   * @param medication Valor de medication requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  abstract create(medication: MedicationEntity): Promise<MedicationEntity>;
  /**
   * Obtiene el listado de medicamentos que cumplen los filtros indicados.
   * @param params Valor de params requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  abstract findAll(
    params?: FindAllMedicationsParams,
  ): Promise<MedicationEntity[]>;
  /**
   * Obtiene un medicamento por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  abstract findById(id: number): Promise<MedicationEntity | null>;
  /**
   * Actualiza un medicamento existente.
   * @param id Identificador único del recurso.
   * @param medication Valor de medication requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  abstract update(
    id: number,
    medication: Partial<MedicationEntity>,
  ): Promise<MedicationEntity>;
  /**
   * Elimina un medicamento por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  abstract delete(id: number): Promise<MedicationEntity>;
}
