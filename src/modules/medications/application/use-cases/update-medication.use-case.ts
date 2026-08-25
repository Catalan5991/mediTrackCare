import { Injectable } from '@nestjs/common';
import { UpdateMedicationDto } from '../dtos/update-medication.dto';
import { MedicationEntity } from '../../domain/entities/medication.entity';
import { MedicationNotFoundException } from '../../domain/exceptions/medication-not-found.exception';
import { MedicationsRepository } from '../../domain/interfaces/medications-repository.interface';

// Actualiza campos parciales solo despues de confirmar que el medicamento existe.
@Injectable()
export class UpdateMedicationUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param medicationsRepository Repositorio utilizado para persistir y consultar medications repository.
   */
  constructor(private readonly medicationsRepository: MedicationsRepository) {}
  /**
   * Actualiza un medicamento aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {MedicationNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(
    id: number,
    dto: UpdateMedicationDto,
  ): Promise<MedicationEntity> {
    const medication = await this.medicationsRepository.findById(id);

    if (!medication) {
      throw new MedicationNotFoundException(id);
    }

    // El repositorio recibe un objeto parcial para conservar valores no enviados.
    return this.medicationsRepository.update(id, dto);
  }
}
