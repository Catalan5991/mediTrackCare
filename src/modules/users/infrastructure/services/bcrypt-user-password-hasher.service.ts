import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserPasswordHasher } from '../../domain/interfaces/user-password-hasher.interface';

@Injectable()
// Implementacion bcrypt del puerto de hashing usado por Users.
export class BcryptUserPasswordHasherService implements UserPasswordHasher {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
}
