import { MedicationEntity } from '../entities/medication.entity';

// Filtros permitidos al consultar el catalogo de medicamentos.
export interface FindAllMedicationsParams {
  search?: string;
  isActive?: boolean;
}

// Puerto de persistencia consumido por la aplicacion sin conocer Prisma.
export abstract class MedicationsRepository {
  abstract create(medication: MedicationEntity): Promise<MedicationEntity>;

  abstract findAll(
    params?: FindAllMedicationsParams,
  ): Promise<MedicationEntity[]>;

  abstract findById(id: number): Promise<MedicationEntity | null>;

  abstract update(
    id: number,
    medication: Partial<MedicationEntity>,
  ): Promise<MedicationEntity>;

  abstract delete(id: number): Promise<MedicationEntity>;
}
