import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordHasher } from '../../domain/interfaces/password-hasher.interface';

@Injectable()
// Implementacion bcrypt del puerto de hashing de contrasenas.
export class BcryptPasswordHasherService implements PasswordHasher {
  private readonly saltRounds = 10;
  /**
   * Compara el recurso solicitado.
   * @param password Contraseña en texto plano que debe procesarse de forma segura.
   * @param hashedPassword Valor de hashed password requerido por la operacion.
   * @returns Indica si la validación o condición se cumple.
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Genera el hash de el recurso solicitado.
   * @param password Contraseña en texto plano que debe procesarse de forma segura.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
}
