export type AuthUserProps = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Entidad de dominio para centralizar datos y exposicion segura del usuario autenticable.
export class AuthUser {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param props Valor de props requerido por la operacion.
   */
  private constructor(private readonly props: AuthUserProps) {}
  /**
   * Crea un usuario autenticado con los datos recibidos.
   * @param props Valor de props requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  static create(props: AuthUserProps): AuthUser {
    return new AuthUser(props);
  }
  /**
   * Ejecuta la operación id.
   * @returns Resultado producido por la operación.
   */
  get id(): number {
    return this.props.id;
  }
  /**
   * Ejecuta la operación name.
   * @returns Resultado producido por la operación.
   */
  get name(): string {
    return this.props.name;
  }
  /**
   * Ejecuta la operación email.
   * @returns Resultado producido por la operación.
   */
  get email(): string {
    return this.props.email;
  }
  /**
   * Ejecuta la operación password.
   * @returns Resultado producido por la operación.
   */
  get password(): string {
    return this.props.password;
  }
  /**
   * Ejecuta la operación role.
   * @returns Resultado producido por la operación.
   */
  get role(): string {
    return this.props.role;
  }
  /**
   * Ejecuta la operación is active.
   * @returns Indica si la validación o condición se cumple.
   */
  get isActive(): boolean {
    return this.props.isActive;
  }
  /**
   * Ejecuta la operación created at.
   * @returns Resultado producido por la operación.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }
  /**
   * Ejecuta la operación updated at.
   * @returns Resultado producido por la operación.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Excluye la contrasena antes de devolver el usuario a controladores o clientes.
  /**
   * Ejecuta la operación to safe object.
   * @returns Resultado producido por la operación.
   */
  toSafeObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
