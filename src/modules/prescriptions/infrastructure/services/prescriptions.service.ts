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

@Injectable()
// Orquesta los casos de uso y adapta los DTOs HTTP a datos de dominio.
export class PrescriptionsService {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param createPrescriptionUseCase Caso de uso encargado de create prescription use case.
   * @param findAllPrescriptionsUseCase Caso de uso encargado de find all prescriptions use case.
   * @param findPrescriptionByIdUseCase Caso de uso encargado de find prescription by id use case.
   * @param updatePrescriptionUseCase Caso de uso encargado de update prescription use case.
   * @param cancelPrescriptionUseCase Caso de uso encargado de cancel prescription use case.
   * @param deletePrescriptionUseCase Caso de uso encargado de delete prescription use case.
   */
  constructor(
    private readonly createPrescriptionUseCase: CreatePrescriptionUseCase,
    private readonly findAllPrescriptionsUseCase: FindAllPrescriptionsUseCase,
    private readonly findPrescriptionByIdUseCase: FindPrescriptionByIdUseCase,
    private readonly updatePrescriptionUseCase: UpdatePrescriptionUseCase,
    private readonly cancelPrescriptionUseCase: CancelPrescriptionUseCase,
    private readonly deletePrescriptionUseCase: DeletePrescriptionUseCase,
  ) {}
  /**
   * Crea un prescripcion con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(dto: CreatePrescriptionDto) {
    // Convierte fechas recibidas como texto a Date antes de enviarlas al caso de uso.
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
   * Obtiene el listado de prescripcions que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(query: FindPrescriptionsQueryDto) {
    return this.findAllPrescriptionsUseCase.execute(query);
  }
  /**
   * Obtiene un prescripcion por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number) {
    return this.findPrescriptionByIdUseCase.execute(id);
  }
  /**
   * Actualiza un prescripcion existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, dto: UpdatePrescriptionDto) {
    // Mantiene los campos opcionales como undefined para no sobrescribir datos no enviados.
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
   * Ejecuta la operación cancel.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  cancel(id: number) {
    return this.cancelPrescriptionUseCase.execute(id);
  }
  /**
   * Elimina un prescripcion por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  delete(id: number) {
    return this.deletePrescriptionUseCase.execute(id);
  }
}
