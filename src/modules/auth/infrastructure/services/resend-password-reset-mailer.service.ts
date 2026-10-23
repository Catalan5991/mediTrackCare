import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { PasswordResetMailer } from '../../domain/interfaces/password-reset-mailer.interface';
@Injectable()
export class ResendPasswordResetMailer implements PasswordResetMailer {
  constructor(private readonly config: ConfigService) {}
  assertConfigured(): void {
    try {
      const url = new URL(this.config.getOrThrow<string>('PASSWORD_RESET_URL'));
      if (
        !['http:', 'https:'].includes(url.protocol) ||
        url.username ||
        url.password
      )
        throw new Error();
      if (
        !this.config.get<string>('RESEND_API_KEY') ||
        !this.config.get<string>('RESEND_FROM')
      )
        throw new Error();
    } catch {
      throw new ServiceUnavailableException(
        'La recuperacion de contrasena no esta configurada.',
      );
    }
  }
  async send(email: string, token: string): Promise<void> {
    const url = new URL(this.config.getOrThrow<string>('PASSWORD_RESET_URL'));
    url.searchParams.set('token', token);
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + this.config.getOrThrow<string>('RESEND_API_KEY'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.config.getOrThrow<string>('RESEND_FROM'),
        to: [email],
        subject: 'Restablecer tu contrasena de MediTrackCare',
        text:
          'Para restablecer tu contrasena, abre este enlace:\n' +
          url.toString() +
          '\n\nEl enlace vence en 15 minutos y solo se puede usar una vez. Si no solicitaste este cambio, ignora este correo.',
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok)
      throw new Error('No fue posible enviar el correo de recuperacion.');
  }
}
