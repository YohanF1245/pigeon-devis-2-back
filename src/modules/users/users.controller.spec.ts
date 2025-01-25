import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../auth/entities/user.entity';
import { UpdateProfileDto } from './dto/profile.dto';
import { Express } from 'express';
import { vi } from 'vitest';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser: User = {
    user_id: 'test-id',
    email: 'test@example.com',
    password: 'hashedPassword',
    first_name: 'Test',
    last_name: 'User',
    role: 'USER',
    phone: '+33123456789',
    signature_path: '/path/to/signature.png',
    is_verified: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const mockUsersService = {
      findById: vi.fn().mockImplementation((id: string) => {
        if (id === 'test-id') {
          return Promise.resolve(mockUser);
        }
        return Promise.resolve(null);
      }),
      updateProfile: vi.fn().mockImplementation((id: string, dto: UpdateProfileDto) => {
        return Promise.resolve({
          ...mockUser,
          user_id: id,
          first_name: dto.first_name,
          last_name: dto.last_name,
          phone: dto.phone,
        });
      }),
      updateSignature: vi.fn().mockImplementation((id: string, signaturePath: string) => {
        return Promise.resolve({
          ...mockUser,
          user_id: id,
          signature_path: signaturePath,
        });
      }),
    };

    controller = new UsersController(mockUsersService as unknown as UsersService);
    usersService = mockUsersService as unknown as UsersService;
  });

  describe('getProfile', () => {
    it('devrait retourner le profil de l\'utilisateur', async () => {
      const req = { user: { sub: 'test-id' } };
      const result = await controller.getProfile(req);
      expect(result).toEqual({
        user_id: 'test-id',
        email: 'test@example.com',
        password: 'hashedPassword',
        first_name: 'Test',
        last_name: 'User',
        role: 'USER',
        phone: '+33123456789',
        signature_path: '/path/to/signature.png',
        is_verified: true,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(usersService.findById).toHaveBeenCalledWith('test-id');
    });
  });

  describe('updateProfile', () => {
    it('devrait mettre à jour le profil de l\'utilisateur', async () => {
      const req = { user: { sub: 'test-id' } };
      const updateProfileDto: UpdateProfileDto = {
        first_name: 'Updated',
        last_name: 'User',
        phone: '+33987654321',
      };
      const result = await controller.updateProfile(req, updateProfileDto);
      expect(result).toEqual({
        ...mockUser,
        first_name: 'Updated',
        last_name: 'User',
        phone: '+33987654321',
      });
      expect(usersService.updateProfile).toHaveBeenCalledWith('test-id', updateProfileDto);
    });
  });

  describe('updateSignature', () => {
    it('devrait mettre à jour la signature de l\'utilisateur', async () => {
      const req = { user: { sub: 'test-id' } };
      const file: Express.Multer.File = {
        fieldname: 'signature',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024,
        destination: '/uploads/signatures/',
        filename: 'test.png',
        path: '/uploads/signatures/test.png',
        buffer: Buffer.from(''),
        stream: null!,
      };
      const result = await controller.updateSignature(req, file);
      expect(result).toEqual({
        ...mockUser,
        signature_path: '/uploads/signatures/test.png',
      });
      expect(usersService.updateSignature).toHaveBeenCalledWith('test-id', '/uploads/signatures/test.png');
    });
  });
}); 