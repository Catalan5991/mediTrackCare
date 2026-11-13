export const PASSWORD_RESET_REPOSITORY = 'PASSWORD_RESET_REPOSITORY';
export interface PasswordResetRepository {
  reserve(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
    now: Date,
  ): Promise<boolean>;
  revoke(tokenHash: string): Promise<void>;
  consume(tokenHash: string, password: string, now: Date): Promise<boolean>;
}
