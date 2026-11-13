import { CreateMedicalMeasurementDto } from '../../application/dtos/create-medical-measurement.dto';
import { UpdateMedicalMeasurementDto } from '../../application/dtos/update-medical-measurement.dto';
import { FindMedicalMeasurementsDto } from '../../application/dtos/find-medical-measurements.dto';
import { MedicalMeasurementEntity } from '../entities/medical-measurement.entity';

export const MEDICAL_MEASUREMENTS_REPOSITORY =
  'MEDICAL_MEASUREMENTS_REPOSITORY';

// Forma comun de respuesta para listados paginados de mediciones.
export interface MedicalMeasurementsPaginatedResponse {
  data: MedicalMeasurementEntity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

// Contrato que desacopla los casos de uso de la implementacion con Prisma.
export interface MedicalMeasurementsRepository {
  /**
   * Crea un medicion medica con los datos recibidos.
   * @param data Datos de data validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(data: CreateMedicalMeasurementDto): Promise<MedicalMeasurementEntity>;
  /**
   * Obtiene el listado de medicion medicas que cumplen los filtros indicados.
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(
    filters: FindMedicalMeasurementsDto,
  ): Promise<MedicalMeasurementsPaginatedResponse>;
  /**
   * Obtiene un medicion medica por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<MedicalMeasurementEntity | null>;
  /**
   * Actualiza un medicion medica existente.
   * @param id Identificador único del recurso.
   * @param data Datos de data validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(
    id: number,
    data: UpdateMedicalMeasurementDto,
  ): Promise<MedicalMeasurementEntity>;

  /**
   * Elimina el recurso solicitado.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   */
  delete(id: number): Promise<void>;
}
