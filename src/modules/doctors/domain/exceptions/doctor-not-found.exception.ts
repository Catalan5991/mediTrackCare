export class DoctorNotFoundException extends Error {
  constructor(id: number) {
    super(`El doctor con id ${id} no fue encontrado`);
    this.name = 'DoctorNotFoundException';
  }
}
