import { PartialType } from '@nestjs/swagger';
import { CreateMedicalMeasurementDto } from './create-medical-measurement.dto';

// Reutiliza las reglas de creacion, pero permite actualizar campos parciales.
export class UpdateMedicalMeasurementDto extends PartialType(
  CreateMedicalMeasurementDto,
) {}
