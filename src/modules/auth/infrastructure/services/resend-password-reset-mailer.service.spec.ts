import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResendPasswordResetMailer } from './resend-password-reset-mailer.service';
describe('ResendPasswordResetMailer', () => {
  const settings = {
    RESEND_API_KEY: 're_test',
    RESEND_FROM: 'MediTrackCare <no-reply@example.com>',
    PASSWORD_RESET_URL: 'https://app.example.com/reset-password?lang=es',
  };
  afterEach(() => jest.restoreAllMocks());
  it('sends the reset URL using Resend without making a real network call', async () => {
    const fetchMock = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: true } as Response);
    const mailer = new ResendPasswordResetMailer(new ConfigService(settings));
    mailer.assertConfigured();
    await mailer.send('maria@example.com', 'a'.repeat(64));
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer re_test' }),
      }),
    );
    const options = fetchMock.mock.calls[0][1]!;
    const body = JSON.parse(options.body as string) as {
      text: string;
      to: string[];
      from: string;
    };
    expect(body.to).toEqual(['maria@example.com']);
    expect(body.from).toBe(settings.RESEND_FROM);
    expect(body.text).toContain(
      'https://app.example.com/reset-password?lang=es&token=' + 'a'.repeat(64),
    );
    expect(body.text).toContain('\n');
  });
  it('rejects unsuccessful provider responses', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: false } as Response);
    await expect(
      new ResendPasswordResetMailer(new ConfigService(settings)).send(
        'maria@example.com',
        'token',
      ),
    ).rejects.toThrow();
  });
  it.each(['RESEND_API_KEY', 'RESEND_FROM', 'PASSWORD_RESET_URL'])(
    'requires %s',
    (key) => {
      const config = { ...settings, [key]: '' };
      expect(() =>
        new ResendPasswordResetMailer(
          new ConfigService(config),
        ).assertConfigured(),
      ).toThrow(ServiceUnavailableException);
    },
  );
  it('rejects unsafe URL protocols', () => {
    expect(() =>
      new ResendPasswordResetMailer(
        new ConfigService({
          ...settings,
          PASSWORD_RESET_URL: 'javascript:alert(1)',
        }),
      ).assertConfigured(),
    ).toThrow(ServiceUnavailableException);
  });
});
