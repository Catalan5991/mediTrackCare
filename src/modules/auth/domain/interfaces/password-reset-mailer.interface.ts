export const PASSWORD_RESET_MAILER = 'PASSWORD_RESET_MAILER';
export interface PasswordResetMailer {
  assertConfigured(): void;
  send(email: string, token: string): Promise<void>;
}
