import { PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';

// Reutiliza las validaciones de creacion, haciendo todos los campos opcionales.
export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
