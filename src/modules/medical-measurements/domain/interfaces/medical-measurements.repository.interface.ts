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
  create(
    data: CreateMedicalMeasurementDto,
  ): Promise<MedicalMeasurementEntity>;

  findAll(
    filters: FindMedicalMeasurementsDto,
  ): Promise<MedicalMeasurementsPaginatedResponse>;

  findById(id: number): Promise<MedicalMeasurementEntity | null>;

  update(
    id: number,
    data: UpdateMedicalMeasurementDto,
  ): Promise<MedicalMeasurementEntity>;

  delete(id: number): Promise<void>;
}
