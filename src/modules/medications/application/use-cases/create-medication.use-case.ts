import { Injectable } from '@nestjs/common';
import { CreateMedicationDto } from '../dtos/create-medication.dto';
import { MedicationEntity } from '../../domain/entities/medication.entity';
import { MedicationsRepository } from '../../domain/interfaces/medications-repository.interface';

// Crea medicamentos activos a partir de datos validados por la capa HTTP.
@Injectable()
export class CreateMedicationUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param medicationsRepository Repositorio utilizado para persistir y consultar medications repository.
   */
  constructor(private readonly medicationsRepository: MedicationsRepository) {}
  /**
   * Crea un medicamento aplicando las reglas del caso de uso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async execute(dto: CreateMedicationDto): Promise<MedicationEntity> {
    const medication = new MedicationEntity({
      name: dto.name,
      description: dto.description,
      presentation: dto.presentation,
      concentration: dto.concentration,
      unit: dto.unit,
      route: dto.route,
      isActive: true,
    });

    // La aplicacion crea la entidad y delega la persistencia al puerto del dominio.
    return this.medicationsRepository.create(medication);
  }
}
