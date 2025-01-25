import { vi } from 'vitest';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.test' });

// Configuration globale de Vitest
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockImplementation((str) => Promise.resolve(`hashed_${str}`)),
    compare: vi.fn().mockImplementation((str, hash) => Promise.resolve(hash === `hashed_${str}`))
  },
  hash: vi.fn().mockImplementation((str) => Promise.resolve(`hashed_${str}`)),
  compare: vi.fn().mockImplementation((str, hash) => Promise.resolve(hash === `hashed_${str}`))
}));

// Mock pour fs
vi.mock('fs', () => ({
  readFileSync: vi.fn()
}));

// Configuration globale pour les tests
beforeAll(() => {
  // Réinitialiser tous les mocks avant chaque test
  vi.clearAllMocks();
});

afterEach(() => {
  // Réinitialiser tous les mocks après chaque test
  vi.clearAllMocks();
}); 