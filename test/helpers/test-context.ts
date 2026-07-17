export type TestRole = 'ADMIN' | 'DOCTOR' | 'CAREGIVER' | 'PATIENT';

export interface Credentials {
  email: string;
  password: string;
}

export interface SeededUser extends Credentials {
  id: number;
  role: TestRole;
}

export interface TestContext {
  users: Record<TestRole, SeededUser>;
  tokens: Partial<Record<TestRole, string>>;
}
