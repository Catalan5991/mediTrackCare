import { PartialType } from '@nestjs/swagger';
import { CreatePrescriptionDto } from './create-prescription.dto';

// Permite actualizar cualquier subconjunto de los campos usados al crear una receta.
export class UpdatePrescriptionDto extends PartialType(CreatePrescriptionDto) {}
