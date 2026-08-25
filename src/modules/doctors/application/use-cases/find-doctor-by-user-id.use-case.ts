import { Inject, Injectable } from '@nestjs/common';

import { DoctorNotFoundException } from '../../domain/exceptions/doctor-not-found.exception';
import {
  DOCTORS_REPOSITORY,
  DoctorsRepository,
} from '../../domain/interfaces/doctors.repository.interface';

@Injectable()
export class FindDoctorByUserIdUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(DOCTORS_REPOSITORY)
    private readonly repository: DoctorsRepository,
  ) {}
  /**
   * Obtiene informacion de medico segun los criterios indicados.
   * @param userId Valor de user id requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {DoctorNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(userId: number) {
    const doctor = await this.repository.findByUserId(userId);
    if (!doctor) throw new DoctorNotFoundException(userId);
    return doctor;
  }
}
