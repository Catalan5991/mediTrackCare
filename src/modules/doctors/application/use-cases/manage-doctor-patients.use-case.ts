import { Inject, Injectable } from '@nestjs/common';

import { DoctorNotFoundException } from '../../domain/exceptions/doctor-not-found.exception';
import {
  DOCTORS_REPOSITORY,
  DoctorsRepository,
} from '../../domain/interfaces/doctors.repository.interface';

@Injectable()
export class ManageDoctorPatientsUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(DOCTORS_REPOSITORY)
    private readonly repository: DoctorsRepository,
  ) {}
  /**
   * Ejecuta la operación assert doctor.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @returns No retorna ningún valor.
   * @throws {DoctorNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  private async assertDoctor(doctorId: number): Promise<void> {
    if (!(await this.repository.findById(doctorId))) {
      throw new DoctorNotFoundException(doctorId);
    }
  }
  /**
   * Ejecuta la operación assign.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @param patientId Valor de patient id requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async assign(doctorId: number, patientId: number) {
    await this.assertDoctor(doctorId);
    return this.repository.assignPatient(doctorId, patientId);
  }
  /**
   * Elimina un medico por su identificador.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @param patientId Valor de patient id requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async remove(doctorId: number, patientId: number) {
    await this.assertDoctor(doctorId);
    return this.repository.removePatient(doctorId, patientId);
  }
  /**
   * Obtiene el listado de medicos que cumplen los filtros indicados.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findAll(doctorId: number) {
    await this.assertDoctor(doctorId);
    return this.repository.findPatientAssignments(doctorId);
  }
}
