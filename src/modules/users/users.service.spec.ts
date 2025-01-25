import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from '../auth/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository: { findOne: any; save: any };

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
      save: vi.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        UsersService
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    vi.clearAllMocks();
  });

  describe('findById', () => {
    it('devrait trouver un utilisateur par son ID', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById('test-id');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: 'test-id' }
      });
    });

    it('devrait lever une exception si l\'utilisateur n\'est pas trouvé', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('nonexistent-id'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    const updateProfileDto = {
      first_name: 'Updated',
      last_name: 'Name',
      phone: '+33123456789'
    };

    it('devrait mettre à jour le profil utilisateur', async () => {
      const updatedUser = {
        ...mockUser,
        ...updateProfileDto
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('test-id', updateProfileDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: 'test-id' }
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('devrait mettre à jour partiellement le profil utilisateur', async () => {
      const partialUpdate = { first_name: 'Updated' };
      const expectedUpdate = {
        ...mockUser,
        first_name: 'Updated'
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(expectedUpdate);

      const result = await service.updateProfile('test-id', partialUpdate);

      expect(mockUserRepository.save).toHaveBeenCalledWith(expectedUpdate);
      expect(result).toEqual(expectedUpdate);
    });

    it('devrait lever une exception si l\'utilisateur n\'est pas trouvé', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.updateProfile('nonexistent-id', updateProfileDto))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('updateSignature', () => {
    it('devrait mettre à jour le chemin de la signature', async () => {
      const signaturePath = '/uploads/signatures/test.png';
      const updatedUser = {
        ...mockUser,
        signature_path: signaturePath
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateSignature('test-id', signaturePath);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: 'test-id' }
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('devrait lever une exception si l\'utilisateur n\'est pas trouvé', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.updateSignature('nonexistent-id', '/path/to/signature.png'))
        .rejects.toThrow(NotFoundException);
    });
  });
}); 