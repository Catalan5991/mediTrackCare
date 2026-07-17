export class DoctorInactiveException extends Error {
  constructor(id: number) {
    super(`El doctor con id ${id} ya está inactivo`);
    this.name = 'DoctorInactiveException';
  }
}
