import { vi } from 'vitest';
import '@nestjs/testing';

// Configuration des mocks globaux
vi.mock('bcrypt', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
  genSalt: vi.fn()
}));

vi.mock('uuid', () => ({
  v4: vi.fn()
})); 