import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { ConflictException } from '@nestjs/common';
import { vi } from 'vitest';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: { findOne: any; create: any; save: any };

  const mockUser = {
    user_id: 'test-id',
    email: 'test@example.com',
    password: 'hashedPassword',
    first_name: 'Test',
    last_name: 'User',
    role: 'USER',
    phone: null,
    signature_path: null,
    is_verified: false,
    created_at: new Date(),
    updated_at: new Date()
  } as User;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        UserService
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    vi.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('devrait trouver un utilisateur par son email', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
    });

    it('devrait retourner null si aucun utilisateur n\'est trouvé', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' }
      });
    });
  });

  describe('create', () => {
    const createUserData = {
      email: 'new@example.com',
      password: 'password123',
      first_name: 'New',
      last_name: 'User'
    };

    it('devrait créer un nouvel utilisateur avec les valeurs par défaut', async () => {
      const now = new Date();
      const expectedUser = {
        ...createUserData,
        user_id: 'new-id',
        role: 'ROLE_USER',
        is_verified: false,
        phone: null,
        signature_path: null,
        created_at: now,
        updated_at: now
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(expectedUser);
      mockUserRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(createUserData);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserData.email }
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserData);
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedUser);
    });

    it('devrait créer un utilisateur avec des champs optionnels', async () => {
      const createUserWithOptionals = {
        ...createUserData,
        phone: '+33123456789',
        signature_path: '/path/to/signature.png'
      };

      const now = new Date();
      const expectedUser = {
        ...createUserWithOptionals,
        user_id: 'new-id',
        role: 'ROLE_USER',
        is_verified: false,
        created_at: now,
        updated_at: now
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(expectedUser);
      mockUserRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(createUserWithOptionals);

      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserWithOptionals);
      expect(result).toEqual(expectedUser);
      expect(result.phone).toBe(createUserWithOptionals.phone);
      expect(result.signature_path).toBe(createUserWithOptionals.signature_path);
    });

    it('devrait rejeter si l\'email existe déjà', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserData))
        .rejects.toThrow(ConflictException);
      
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserData.email }
      });
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('devrait propager les erreurs de la base de données', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(createUserData);
      const error = new Error('Erreur de base de données');
      mockUserRepository.save.mockRejectedValue(error);

      await expect(service.create(createUserData))
        .rejects.toThrow('Erreur de base de données');
    });
  });
}); 