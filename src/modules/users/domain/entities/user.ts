export type UserProps = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SafeUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Entidad de dominio que protege el acceso directo a las propiedades persistidas.
export class User {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param props Valor de props requerido por la operacion.
   */
  private constructor(private readonly props: UserProps) {}
  /**
   * Crea un usuario con los datos recibidos.
   * @param props Valor de props requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  static create(props: UserProps): User {
    return new User(props);
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

  // Proyeccion segura para controladores y respuestas HTTP.
  /**
   * Ejecuta la operación to safe object.
   * @returns Resultado producido por la operación.
   */
  toSafeObject(): SafeUser {
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
