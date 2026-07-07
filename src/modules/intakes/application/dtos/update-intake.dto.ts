import { PartialType } from '@nestjs/swagger';
import { CreateIntakeDto } from './create-intake.dto';

// Reutiliza las reglas de creacion, pero permite actualizar campos parciales.
export class UpdateIntakeDto extends PartialType(CreateIntakeDto) {}
