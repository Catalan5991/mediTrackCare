export class DoctorAlreadyExistsException extends Error {
  constructor(message = 'El doctor ya existe') {
    super(message);
    this.name = 'DoctorAlreadyExistsException';
  }
}
