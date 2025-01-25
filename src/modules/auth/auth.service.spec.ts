import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from './services/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: { findByEmail: any; create: any };
  let mockJwtService: { sign: any; verifyAsync: any };

  const mockUser = {
    user_id: 'test-id',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'USER',
    first_name: 'Test',
    last_name: 'User',
    phone: null,
    signature_path: null,
    is_verified: false,
    created_at: new Date(),
    updated_at: new Date()
  } as User;

  beforeEach(async () => {
    mockUserService = {
      findByEmail: vi.fn(),
      create: vi.fn()
    };

    mockJwtService = {
      sign: vi.fn(),
      verifyAsync: vi.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        {
          provide: AuthService,
          useFactory: () => new AuthService(mockJwtService as JwtService, mockUserService as UserService)
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    vi.clearAllMocks();
  });

  describe('validateUser', () => {
    it('devrait valider un utilisateur avec des identifiants corrects', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(result).toEqual(mockUser);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });

    it('devrait rejeter un utilisateur avec un email invalide', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser('invalid@example.com', 'password123')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('devrait rejeter un utilisateur avec un mot de passe invalide', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      vi.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.validateUser('test@example.com', 'wrongpassword')
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('devrait générer un token JWT valide', async () => {
      const mockToken = 'jwt-token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login({
        user_id: mockUser.user_id,
        email: mockUser.email,
        role: mockUser.role
      });

      expect(result).toEqual({ access_token: mockToken });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.user_id,
        email: mockUser.email,
        role: mockUser.role
      });
    });
  });

  describe('validateToken', () => {
    it('devrait valider un token JWT', async () => {
      const mockPayload = {
        sub: mockUser.user_id,
        email: mockUser.email,
        role: mockUser.role
      };
      const mockToken = 'valid-token';

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

      const result = await service.validateToken(mockToken);

      expect(result).toEqual(mockPayload);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(mockToken);
    });

    it('devrait rejeter un token invalide', async () => {
      const invalidToken = 'invalid-token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.validateToken(invalidToken)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    beforeEach(() => {
      mockUserService.create = vi.fn();
      vi.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
    });

    it('devrait créer un nouvel utilisateur avec un mot de passe hashé', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const firstName = 'Test';
      const lastName = 'User';

      mockUserService.create.mockResolvedValue(mockUser);

      const result = await service.register(email, password, firstName, lastName);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 'salt');
      expect(mockUserService.create).toHaveBeenCalledWith({
        email,
        password: 'hashedPassword',
        first_name: firstName,
        last_name: lastName
      });
      expect(result).toEqual(mockUser);
    });

    it('devrait propager les erreurs du service utilisateur', async () => {
      const error = new Error('Erreur de création');
      mockUserService.create.mockRejectedValue(error);

      await expect(
        service.register('test@example.com', 'password123', 'Test', 'User')
      ).rejects.toThrow('Erreur de création');
    });
  });
}); 