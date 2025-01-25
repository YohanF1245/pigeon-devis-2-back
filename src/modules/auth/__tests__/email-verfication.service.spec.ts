// src/modules/auth/__tests__/email-verification.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerificationService } from '../services/email-verification.service';
import { MailService } from '../../mail/mail.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerification } from '../entities/email-verification.entity';
import { User } from '../entities/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { vi } from 'vitest';
import * as fs from 'fs';

vi.mock('fs', () => ({
  readFileSync: vi.fn().mockReturnValue('Hello {{firstName}}, please verify your email: {{verificationLink}}'),
}));

describe('EmailVerificationService', () => {
  let service: EmailVerificationService;
  let emailVerificationRepository: Repository<EmailVerification>;
  let userRepository: Repository<User>;
  let mailService: { sendVerificationEmail: any };

  const mockEmailVerificationRepository = {
    delete: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    remove: vi.fn(),
  };

  const mockUserRepository = {
    save: vi.fn(),
  };

  const mockUser: User = {
    user_id: 'user-id',
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
    is_verified: false,
    role: 'ROLE_USER',
    password: 'hashed-password',
    phone: '123-456-7890',
    signature_path: 'path/to/signature',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    mailService = {
      sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EmailVerificationService,
          useFactory: () => new EmailVerificationService(
            mockEmailVerificationRepository as any,
            mockUserRepository as any,
            mailService as any,
          ),
        },
      ],
    }).compile();

    service = module.get<EmailVerificationService>(EmailVerificationService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createVerification', () => {
    it('should create a verification and send an email', async () => {
      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const verification = { token, expires_at: expiresAt };
      mockEmailVerificationRepository.delete.mockResolvedValue(undefined);
      mockEmailVerificationRepository.create.mockReturnValue(verification);
      mockEmailVerificationRepository.save.mockResolvedValue(verification);

      await service.createVerification(mockUser);

      expect(mockEmailVerificationRepository.delete).toHaveBeenCalledWith({ user_id: mockUser.user_id });
      expect(mockEmailVerificationRepository.create).toHaveBeenCalledWith({
        token,
        expires_at: expect.any(Date),
        user_id: mockUser.user_id,
      });
      expect(mockEmailVerificationRepository.save).toHaveBeenCalledWith(verification);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        mockUser.email,
        token,
        mockUser.first_name
      );
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with a valid token', async () => {
      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const verification = {
        token,
        expires_at: expiresAt,
        user: mockUser,
      };

      mockEmailVerificationRepository.findOne.mockResolvedValue(verification);
      mockUserRepository.save.mockResolvedValue(mockUser);

      await service.verifyEmail(token);

      expect(mockUser.is_verified).toBe(true);
      expect(mockEmailVerificationRepository.remove).toHaveBeenCalledWith(verification);
    });

    it('should throw NotFoundException for an invalid token', async () => {
      const token = uuidv4();
      mockEmailVerificationRepository.findOne.mockResolvedValue(null);

      await expect(service.verifyEmail(token)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for an expired token', async () => {
      const token = uuidv4();
      const expiredDate = new Date();
      expiredDate.setHours(expiredDate.getHours() - 1);

      const verification = {
        token,
        expires_at: expiredDate,
        user: mockUser,
      };

      mockEmailVerificationRepository.findOne.mockResolvedValue(verification);

      await expect(service.verifyEmail(token)).rejects.toThrow(BadRequestException);
      expect(mockEmailVerificationRepository.remove).toHaveBeenCalledWith(verification);
    });
  });
});