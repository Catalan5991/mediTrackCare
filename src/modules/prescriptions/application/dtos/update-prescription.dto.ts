import { PartialType } from '@nestjs/mapped-types';
import { CreatePrescriptionDto } from './create-prescription.dto';

// Permite actualizar cualquier subconjunto de los campos usados al crear una receta.
export class UpdatePrescriptionDto extends PartialType(CreatePrescriptionDto) {}
