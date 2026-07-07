import { PartialType } from '@nestjs/swagger';
import { CreateReminderDto } from './create-reminder.dto';

// Reutiliza las reglas de creacion, pero permite actualizar campos parciales.
export class UpdateReminderDto extends PartialType(CreateReminderDto) {}
