import { NotFoundException } from '@nestjs/common';

export class FileNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`No se encontro el archivo con ID ${id}.`);
  }
}
