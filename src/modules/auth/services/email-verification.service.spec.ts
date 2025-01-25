import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerification } from '../entities/email-verification.entity';
import { User } from '../entities/user.entity';
import { MailService } from '../../mail/mail.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { vi } from 'vitest';
import { v4 as uuidv4 } from 'uuid';

vi.mock('uuid', () => ({
  v4: vi.fn()
}));

describe('EmailVerificationService', () => {
  let service: EmailVerificationService;
  let mockEmailVerificationRepository: { create: any; save: any; findOne: any; delete: any; remove: any };
  let mockUserRepository: { save: any };
  let mockMailService: { sendVerificationEmail: any };

  const mockUser = {
    user_id: 'test-id',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    password: 'hashedPassword',
    role: 'USER',
    phone: null,
    signature_path: null,
    is_verified: false,
    created_at: new Date(),
    updated_at: new Date()
  } as User;

  const mockEmailVerification = {
    token: 'test-token',
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    user_id: mockUser.user_id,
    user: mockUser,
    created_at: new Date(),
    updated_at: new Date()
  } as EmailVerification;

  beforeEach(async () => {
    mockEmailVerificationRepository = {
      create: vi.fn(),
      save: vi.fn(),
      findOne: vi.fn(),
      delete: vi.fn(),
      remove: vi.fn()
    };

    mockUserRepository = {
      save: vi.fn()
    };

    mockMailService = {
      sendVerificationEmail: vi.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(EmailVerification),
          useValue: mockEmailVerificationRepository
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: MailService,
          useValue: mockMailService
        },
        {
          provide: EmailVerificationService,
          useFactory: () => new EmailVerificationService(
            mockEmailVerificationRepository as Repository<EmailVerification>,
            mockUserRepository as Repository<User>,
            mockMailService as MailService
          )
        }
      ],
    }).compile();

    service = module.get<EmailVerificationService>(EmailVerificationService);

    vi.clearAllMocks();
  });

  describe('createVerification', () => {
    it('devrait créer une nouvelle vérification et envoyer un email', async () => {
      const mockToken = 'test-token';
      (uuidv4 as any).mockReturnValue(mockToken);

      mockEmailVerificationRepository.create.mockImplementation((data) => ({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
        user: mockUser
      }));
      mockEmailVerificationRepository.save.mockImplementation((data) => data);
      mockEmailVerificationRepository.delete.mockResolvedValue(undefined);
      mockMailService.sendVerificationEmail.mockResolvedValue(undefined);

      await service.createVerification(mockUser);

      expect(mockEmailVerificationRepository.delete).toHaveBeenCalledWith({
        user_id: mockUser.user_id
      });

      const createCall = mockEmailVerificationRepository.create.mock.calls[0][0];
      expect(createCall).toEqual({
        token: mockToken,
        expires_at: expect.any(Date),
        user_id: mockUser.user_id
      });

      const saveCall = mockEmailVerificationRepository.save.mock.calls[0][0];
      expect(saveCall).toEqual(expect.objectContaining({
        token: mockToken,
        expires_at: expect.any(Date),
        user_id: mockUser.user_id
      }));

      const sendEmailCall = mockMailService.sendVerificationEmail.mock.calls[0];
      expect(sendEmailCall).toEqual([
        mockUser.email,
        mockToken,
        mockUser.first_name
      ]);
    });
  });

  describe('verifyEmail', () => {
    it('devrait vérifier un email avec un token valide', async () => {
      mockEmailVerificationRepository.findOne.mockResolvedValue(mockEmailVerification);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, is_verified: true });
      mockEmailVerificationRepository.remove.mockResolvedValue(mockEmailVerification);

      await service.verifyEmail('test-token');

      expect(mockEmailVerificationRepository.findOne).toHaveBeenCalledWith({
        where: { token: 'test-token' },
        relations: ['user']
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        is_verified: true
      });
      expect(mockEmailVerificationRepository.remove).toHaveBeenCalledWith(mockEmailVerification);
    });

    it('devrait rejeter un token invalide', async () => {
      mockEmailVerificationRepository.findOne.mockResolvedValue(null);

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(NotFoundException);
    });

    it('devrait rejeter un token expiré', async () => {
      const expiredVerification = {
        ...mockEmailVerification,
        expires_at: new Date(Date.now() - 1000)
      };
      mockEmailVerificationRepository.findOne.mockResolvedValue(expiredVerification);

      await expect(service.verifyEmail('expired-token')).rejects.toThrow(BadRequestException);
    });
  });
}); 