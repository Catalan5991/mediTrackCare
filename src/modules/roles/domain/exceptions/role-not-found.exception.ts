// Error de dominio lanzado cuando una operacion requiere un rol existente, pero
// el id recibido no corresponde a ningun registro persistido.
export class RoleNotFoundException extends Error {
  constructor(id: number) {
    super(`El rol con id ${id} no fue encontrado`);
    this.name = 'RoleNotFoundException';
  }
}
