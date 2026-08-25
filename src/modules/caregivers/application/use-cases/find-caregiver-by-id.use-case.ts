import { Inject, Injectable } from '@nestjs/common';
import { CaregiverNotFoundException } from '../../domain/exceptions/caregiver-not-found.exception';
import {
  CAREGIVERS_REPOSITORY,
  CaregiversRepository,
} from '../../domain/interfaces/caregivers.repository.interface';

// Caso de uso de detalle. La ausencia de registro se expresa como excepcion de
// dominio para que la capa HTTP pueda responder 404 de forma uniforme.
@Injectable()
export class FindCaregiverByIdUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param caregiversRepository Repositorio utilizado para persistir y consultar caregivers repository.
   */
  constructor(
    @Inject(CAREGIVERS_REPOSITORY)
    private readonly caregiversRepository: CaregiversRepository,
  ) {}
  /**
   * Obtiene informacion de cuidador segun los criterios indicados.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {CaregiverNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number) {
    const caregiver = await this.caregiversRepository.findById(id);

    if (!caregiver) {
      throw new CaregiverNotFoundException(id);
    }

    return caregiver;
  }
}
