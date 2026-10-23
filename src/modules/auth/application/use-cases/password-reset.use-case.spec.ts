import { BadRequestException, Logger } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { AuthUser } from '../../domain/entities/auth-user';
import { PasswordResetUseCase } from './password-reset.use-case';

const hash = (value: string) =>
  createHash('sha256').update(value).digest('hex');
describe('PasswordResetUseCase', () => {
  const user = AuthUser.create({
    id: 1,
    name: 'Maria',
    email: 'maria@example.com',
    password: 'old',
    role: 'PATIENT',
    roleIsActive: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const users = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };
  const hasher = { hash: jest.fn(), compare: jest.fn() };
  const resets = { reserve: jest.fn(), consume: jest.fn(), revoke: jest.fn() };
  const mailer = { assertConfigured: jest.fn(), send: jest.fn() };
  let useCase: PasswordResetUseCase;
  beforeEach(() => {
    jest.resetAllMocks();
    users.findByEmail.mockResolvedValue(user);
    resets.reserve.mockResolvedValue(true);
    resets.consume.mockResolvedValue(true);
    hasher.hash.mockResolvedValue('bcrypt-hash');
    useCase = new PasswordResetUseCase(users, hasher, resets, mailer);
  });
  afterEach(() => jest.restoreAllMocks());
  it('sends a random token but stores only its hash with a 15 minute expiry', async () => {
    const response = await useCase.request({ email: ' MARIA@EXAMPLE.COM ' });
    expect(users.findByEmail).toHaveBeenCalledWith('maria@example.com');
    const [email, token] = mailer.send.mock.calls[0] as [string, string];
    expect(email).toBe(user.email);
    expect(token).toMatch(/^[a-f0-9]{64}$/);
    const [id, stored, expiresAt, now] = resets.reserve.mock.calls[0] as [
      number,
      string,
      Date,
      Date,
    ];
    expect(id).toBe(user.id);
    expect(stored).toBe(hash(token));
    expect(expiresAt.getTime() - now.getTime()).toBe(900_000);
    expect(JSON.stringify(response)).not.toContain(token);
  });
  it('does not expose whether an email exists or was limited', async () => {
    const success = await useCase.request({ email: user.email });
    mailer.send.mockClear();
    resets.reserve.mockResolvedValue(false);
    expect(await useCase.request({ email: user.email })).toEqual(success);
    users.findByEmail.mockResolvedValue(null);
    expect(await useCase.request({ email: 'unknown@example.com' })).toEqual(
      success,
    );
    expect(mailer.send).not.toHaveBeenCalled();
  });
  it.each(['isActive', 'roleIsActive'])(
    'does not send for an inactive %s',
    async (field) => {
      users.findByEmail.mockResolvedValue({
        ...user.toSafeObject(),
        isActive: true,
        roleIsActive: true,
        [field]: false,
      });
      await useCase.request({ email: user.email });
      expect(resets.reserve).not.toHaveBeenCalled();
      expect(mailer.send).not.toHaveBeenCalled();
    },
  );
  it('revokes an undelivered token without exposing provider errors', async () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    mailer.send.mockRejectedValue(new Error('provider details'));
    await expect(
      useCase.request({ email: user.email }),
    ).resolves.toHaveProperty('message');
    const token = mailer.send.mock.calls[0][1] as string;
    expect(resets.revoke).toHaveBeenCalledWith(hash(token));
  });
  it('stores a hashed password and passes the token hash to atomic consumption', async () => {
    await expect(
      useCase.reset({ token: 'a'.repeat(64), newPassword: 'NuevaClave123' }),
    ).resolves.toHaveProperty('message');
    expect(hasher.hash).toHaveBeenCalledWith('NuevaClave123');
    expect(resets.consume).toHaveBeenCalledWith(
      hash('a'.repeat(64)),
      'bcrypt-hash',
      expect.any(Date),
    );
  });
  it.each(['expired', 'used', 'unknown'])('rejects an %s token', async () => {
    resets.consume.mockResolvedValue(false);
    await expect(
      useCase.reset({ token: 'a'.repeat(64), newPassword: 'NuevaClave123' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
  it('rejects passwords exceeding bcrypt byte limit', async () => {
    await expect(
      useCase.reset({ token: 'a'.repeat(64), newPassword: '??'.repeat(19) }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(hasher.hash).not.toHaveBeenCalled();
    expect(resets.consume).not.toHaveBeenCalled();
  });
});
