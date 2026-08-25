import { Injectable } from '@nestjs/common';
import { MedicationEntity } from '../../domain/entities/medication.entity';
import { MedicationNotFoundException } from '../../domain/exceptions/medication-not-found.exception';
import { MedicationsRepository } from '../../domain/interfaces/medications-repository.interface';

// Recupera un medicamento puntual y traduce ausencias a una excepcion de dominio.
@Injectable()
export class FindMedicationByIdUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param medicationsRepository Repositorio utilizado para persistir y consultar medications repository.
   */
  constructor(private readonly medicationsRepository: MedicationsRepository) {}
  /**
   * Obtiene informacion de medicamento segun los criterios indicados.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {MedicationNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<MedicationEntity> {
    const medication = await this.medicationsRepository.findById(id);

    if (!medication) {
      throw new MedicationNotFoundException(id);
    }

    return medication;
  }
}
