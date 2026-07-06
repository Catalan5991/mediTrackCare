import { Injectable } from '@nestjs/common';

import { CreateMedicalMeasurementDto } from '../../application/dtos/create-medical-measurement.dto';
import { UpdateMedicalMeasurementDto } from '../../application/dtos/update-medical-measurement.dto';
import { FindMedicalMeasurementsDto } from '../../application/dtos/find-medical-measurements.dto';
import { CreateMedicalMeasurementUseCase } from '../../application/use-cases/create-medical-measurement.use-case';
import { FindMedicalMeasurementsUseCase } from '../../application/use-cases/find-medical-measurements.use-case';
import { FindMedicalMeasurementByIdUseCase } from '../../application/use-cases/find-medical-measurement-by-id.use-case';
import { UpdateMedicalMeasurementUseCase } from '../../application/use-cases/update-medical-measurement.use-case';
import { DeleteMedicalMeasurementUseCase } from '../../application/use-cases/delete-medical-measurement.use-case';

@Injectable()
// Fachada de infraestructura que mantiene el controller desacoplado de los casos de uso.
export class MedicalMeasurementsService {
  constructor(
    private readonly createMedicalMeasurementUseCase: CreateMedicalMeasurementUseCase,
    private readonly findMedicalMeasurementsUseCase: FindMedicalMeasurementsUseCase,
    private readonly findMedicalMeasurementByIdUseCase: FindMedicalMeasurementByIdUseCase,
    private readonly updateMedicalMeasurementUseCase: UpdateMedicalMeasurementUseCase,
    private readonly deleteMedicalMeasurementUseCase: DeleteMedicalMeasurementUseCase,
  ) {}

  create(dto: CreateMedicalMeasurementDto) {
    // Cada metodo delega una accion HTTP en su caso de uso correspondiente.
    return this.createMedicalMeasurementUseCase.execute(dto);
  }

  findAll(filters: FindMedicalMeasurementsDto) {
    return this.findMedicalMeasurementsUseCase.execute(filters);
  }

  findOne(id: number) {
    return this.findMedicalMeasurementByIdUseCase.execute(id);
  }

  update(id: number, dto: UpdateMedicalMeasurementDto) {
    return this.updateMedicalMeasurementUseCase.execute(id, dto);
  }

  remove(id: number) {
    return this.deleteMedicalMeasurementUseCase.execute(id);
  }
}
