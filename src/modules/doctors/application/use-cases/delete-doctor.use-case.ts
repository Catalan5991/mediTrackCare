import { Inject, Injectable } from '@nestjs/common';

import { DoctorNotFoundException } from '../../domain/exceptions/doctor-not-found.exception';
import { DoctorInactiveException } from '../../domain/exceptions/doctor-inactive.exception';
import {
  DOCTORS_REPOSITORY,
  DoctorsRepository,
} from '../../domain/interfaces/doctors.repository.interface';

@Injectable()
export class DeleteDoctorUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(DOCTORS_REPOSITORY)
    private readonly repository: DoctorsRepository,
  ) {}
  /**
   * Elimina un medico aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {DoctorNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   * @throws {DoctorInactiveException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number) {
    const doctor = await this.repository.findById(id);
    if (!doctor) {
      throw new DoctorNotFoundException(id);
    }
    if (!doctor.isActive) throw new DoctorInactiveException(id);
    return this.repository.softDelete(id);
  }
}
