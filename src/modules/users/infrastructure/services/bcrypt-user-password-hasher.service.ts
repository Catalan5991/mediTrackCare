import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserPasswordHasher } from '../../domain/interfaces/user-password-hasher.interface';

@Injectable()
// Implementacion bcrypt del puerto de hashing usado por Users.
export class BcryptUserPasswordHasherService implements UserPasswordHasher {
  private readonly saltRounds = 10;

  /**
   * Genera el hash de el recurso solicitado.
   * @param password Contraseña en texto plano que debe procesarse de forma segura.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
}
