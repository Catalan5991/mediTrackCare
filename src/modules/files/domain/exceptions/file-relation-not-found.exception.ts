import { BadRequestException } from '@nestjs/common';

export class FileRelationNotFoundException extends BadRequestException {
  constructor(relation: string) {
    super(`La relacion indicada no existe: ${relation}.`);
  }
}
