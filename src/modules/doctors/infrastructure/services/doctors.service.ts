import { Injectable } from '@nestjs/common';

import { CreateDoctorDto } from '../../application/dtos/create-doctor.dto';
import { QueryDoctorDto } from '../../application/dtos/query-doctor.dto';
import { UpdateDoctorDto } from '../../application/dtos/update-doctor.dto';
import { CreateDoctorUseCase } from '../../application/use-cases/create-doctor.use-case';
import { DeleteDoctorUseCase } from '../../application/use-cases/delete-doctor.use-case';
import { FindAllDoctorsUseCase } from '../../application/use-cases/find-all-doctors.use-case';
import { FindDoctorByIdUseCase } from '../../application/use-cases/find-doctor-by-id.use-case';
import { FindDoctorByUserIdUseCase } from '../../application/use-cases/find-doctor-by-user-id.use-case';
import { UpdateDoctorUseCase } from '../../application/use-cases/update-doctor.use-case';
import { ManageDoctorPatientsUseCase } from '../../application/use-cases/manage-doctor-patients.use-case';

@Injectable()
export class DoctorsService {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param createDoctor Caso de uso encargado de create doctor.
   * @param findAllDoctors Caso de uso encargado de find all doctors.
   * @param findDoctorById Caso de uso encargado de find doctor by id.
   * @param findDoctorByUserId Caso de uso encargado de find doctor by user id.
   * @param updateDoctor Caso de uso encargado de update doctor.
   * @param deleteDoctor Caso de uso encargado de delete doctor.
   * @param managePatients Caso de uso encargado de manage patients.
   */
  constructor(
    private readonly createDoctor: CreateDoctorUseCase,
    private readonly findAllDoctors: FindAllDoctorsUseCase,
    private readonly findDoctorById: FindDoctorByIdUseCase,
    private readonly findDoctorByUserId: FindDoctorByUserIdUseCase,
    private readonly updateDoctor: UpdateDoctorUseCase,
    private readonly deleteDoctor: DeleteDoctorUseCase,
    private readonly managePatients: ManageDoctorPatientsUseCase,
  ) {}
  /**
   * Crea un medico con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(dto: CreateDoctorDto) {
    return this.createDoctor.execute(dto);
  }
  /**
   * Obtiene el listado de medicos que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(query: QueryDoctorDto) {
    return this.findAllDoctors.execute(query);
  }
  /**
   * Obtiene un medico por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findOne(id: number) {
    return this.findDoctorById.execute(id);
  }
  /**
   * Obtiene mine.
   * @param userId Valor de user id requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findMine(userId: number) {
    return this.findDoctorByUserId.execute(userId);
  }
  /**
   * Actualiza un medico existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, dto: UpdateDoctorDto) {
    return this.updateDoctor.execute(id, dto);
  }
  /**
   * Elimina un medico por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  remove(id: number) {
    return this.deleteDoctor.execute(id);
  }
  /**
   * Ejecuta la operación assign patient.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @param patientId Valor de patient id requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  assignPatient(doctorId: number, patientId: number) {
    return this.managePatients.assign(doctorId, patientId);
  }
  /**
   * Elimina patient.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @param patientId Valor de patient id requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  removePatient(doctorId: number, patientId: number) {
    return this.managePatients.remove(doctorId, patientId);
  }
  /**
   * Obtiene patients.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findPatients(doctorId: number) {
    return this.managePatients.findAll(doctorId);
  }
}
