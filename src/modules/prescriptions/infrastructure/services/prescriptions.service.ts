import { Injectable } from '@nestjs/common';
import { CreatePrescriptionDto } from '../../application/dtos/create-prescription.dto';
import { UpdatePrescriptionDto } from '../../application/dtos/update-prescription.dto';
import { FindPrescriptionsQueryDto } from '../../application/dtos/find-prescriptions-query.dto';
import { CreatePrescriptionUseCase } from '../../application/use-cases/create-prescription.use-case';
import { FindAllPrescriptionsUseCase } from '../../application/use-cases/find-all-prescriptions.use-case';
import { FindPrescriptionByIdUseCase } from '../../application/use-cases/find-prescription-by-id.use-case';
import { UpdatePrescriptionUseCase } from '../../application/use-cases/update-prescription.use-case';
import { CancelPrescriptionUseCase } from '../../application/use-cases/cancel-prescription.use-case';
import { DeletePrescriptionUseCase } from '../../application/use-cases/delete-prescription.use-case';

/**
 * Servicio encargado de orquestar los casos de uso del módulo de Prescriptions
 * y transformar los DTOs de transporte HTTP a entidades del modelo de dominio.
 */
@Injectable()
export class PrescriptionsService {
  constructor(
    private readonly createPrescriptionUseCase: CreatePrescriptionUseCase,
    private readonly findAllPrescriptionsUseCase: FindAllPrescriptionsUseCase,
    private readonly findPrescriptionByIdUseCase: FindPrescriptionByIdUseCase,
    private readonly updatePrescriptionUseCase: UpdatePrescriptionUseCase,
    private readonly cancelPrescriptionUseCase: CancelPrescriptionUseCase,
    private readonly deletePrescriptionUseCase: DeletePrescriptionUseCase,
  ) {}

  /**
   * Registra una nueva prescripción médica convirtiendo las fechas a formato Date.
   * @param {CreatePrescriptionDto} dto - Datos de la receta médica e ítems de medicamentos.
   * @returns {Promise<any>} Objeto de la receta médica persistida con sus relaciones.
   */
  create(dto: CreatePrescriptionDto) {
    return this.createPrescriptionUseCase.execute({
      ...dto,
      issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
      expirationDate: dto.expirationDate
        ? new Date(dto.expirationDate)
        : undefined,
      items: dto.items.map((item) => ({
        ...item,
        startDate: item.startDate ? new Date(item.startDate) : undefined,
        endDate: item.endDate ? new Date(item.endDate) : undefined,
      })),
    });
  }

  /**
   * Recupera todas las recetas médicas aplicando los filtros de consulta.
   * @param {FindPrescriptionsQueryDto} query - Parámetros de búsqueda, filtros y paginación.
   * @returns {Promise<any>} Lista y metadata de las recetas médicas registradas.
   */
  findAll(query: FindPrescriptionsQueryDto) {
    return this.findAllPrescriptionsUseCase.execute(query);
  }

  /**
   * Obtiene la información detallada de una receta médica por su identificador único.
   * @param {number} id - Identificador numérico de la prescripción.
   * @returns {Promise<any>} Objeto detallado de la receta médica solicitada.
   */
  findById(id: number) {
    return this.findPrescriptionByIdUseCase.execute(id);
  }

  /**
   * Actualiza los datos o instrucciones de una prescripción médica existente.
   * @param {number} id - Identificador numérico de la receta a modificar.
   * @param {UpdatePrescriptionDto} dto - Datos modificados de la receta.
   * @returns {Promise<any>} Objeto de la receta médica con los cambios aplicados.
   */
  update(id: number, dto: UpdatePrescriptionDto) {
    return this.updatePrescriptionUseCase.execute(id, {
      ...dto,
      issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
      expirationDate: dto.expirationDate
        ? new Date(dto.expirationDate)
        : undefined,
      items: dto.items?.map((item) => ({
        ...item,
        startDate: item.startDate ? new Date(item.startDate) : undefined,
        endDate: item.endDate ? new Date(item.endDate) : undefined,
      })),
    });
  }

  /**
   * Cancela una prescripción médica activa dentro del sistema.
   * @param {number} id - Identificador numérico de la receta a cancelar.
   * @returns {Promise<any>} Confirmación de la cancelación de la receta.
   */
  cancel(id: number) {
    return this.cancelPrescriptionUseCase.execute(id);
  }

  /**
   * Elimina un registro de prescripción médica de la base de datos.
   * @param {number} id - Identificador numérico de la receta a eliminar.
   * @returns {Promise<any>} Resultado de la operación de eliminación.
   */
  delete(id: number) {
    return this.deletePrescriptionUseCase.execute(id);
  }
}