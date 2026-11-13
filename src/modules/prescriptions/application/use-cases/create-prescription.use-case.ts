import { Inject, Injectable } from '@nestjs/common';
import {
  CreatePrescriptionInput,
  PRESCRIPTION_REPOSITORY,
  PrescriptionRepository,
} from '../../domain/interfaces/prescription-repository.interface';
import { PrescriptionEntity } from '../../domain/entities/prescription.entity';
import { InvalidPrescriptionException } from '../../domain/exceptions/invalid-prescription.exception';

@Injectable()
// Caso de uso responsable de validar y registrar una nueva receta.
export class CreatePrescriptionUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly repository: PrescriptionRepository,
  ) {}
  /**
   * Crea un prescripcion aplicando las reglas del caso de uso.
   * @param data Valor de data requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {InvalidPrescriptionException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(data: CreatePrescriptionInput): Promise<PrescriptionEntity> {
    // Una receta valida debe incluir al menos un medicamento.
    if (!data.items || data.items.length === 0) {
      throw new InvalidPrescriptionException(
        'La receta debe contener al menos un medicamento',
      );
    }

    return this.repository.create(data);
  }
}
