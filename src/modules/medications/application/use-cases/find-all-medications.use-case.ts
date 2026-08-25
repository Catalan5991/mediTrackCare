import { Injectable } from '@nestjs/common';
import { MedicationEntity } from '../../domain/entities/medication.entity';
import {
  FindAllMedicationsParams,
  MedicationsRepository,
} from '../../domain/interfaces/medications-repository.interface';

// Lista medicamentos aplicando filtros opcionales de busqueda y estado activo.
@Injectable()
export class FindAllMedicationsUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param medicationsRepository Repositorio utilizado para persistir y consultar medications repository.
   */
  constructor(private readonly medicationsRepository: MedicationsRepository) {}
  /**
   * Obtiene informacion de medicamento segun los criterios indicados.
   * @param params Valor de params requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async execute(
    params?: FindAllMedicationsParams,
  ): Promise<MedicationEntity[]> {
    return this.medicationsRepository.findAll(params);
  }
}
