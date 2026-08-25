import { Inject, Injectable } from '@nestjs/common';

import {
  DOCTORS_REPOSITORY,
  DoctorsRepository,
} from '../../domain/interfaces/doctors.repository.interface';
import { QueryDoctorDto } from '../dtos/query-doctor.dto';

@Injectable()
export class FindAllDoctorsUseCase {
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
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  execute(query: QueryDoctorDto) {
    return this.repository.findAll({
      ...query,
      isActive: query.isActive ?? true,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
  }
}
