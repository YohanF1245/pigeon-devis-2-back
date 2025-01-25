// src/modules/mail/__tests__/mail.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { vi } from 'vitest';
import * as fs from 'fs';

vi.mock('fs', () => ({
  readFileSync: vi.fn().mockReturnValue('Hello {{firstName}}, please verify your email: {{verificationLink}}'),
}));

describe('MailService', () => {
  let service: MailService;
  let mailerService: { sendMail: any };
  let configService: { get: any };

  beforeEach(async () => {
    mailerService = {
      sendMail: vi.fn().mockResolvedValue(true),
    };

    configService = {
      get: vi.fn((key: string) => {
        if (key === 'APP_URL') {
          return 'http://localhost:3000';
        }
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MailService,
          useFactory: () => new MailService(mailerService as any, configService as any),
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('sendVerificationEmail', () => {
    it('should send a verification email successfully', async () => {
      const email = 'test@example.com';
      const token = 'test-token';
      const firstName = 'John';

      await service.sendVerificationEmail(email, token, firstName);

      expect(mailerService.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: email,
        subject: 'Vérification de votre adresse email',
        html: expect.stringContaining(firstName),
      }));
      expect(configService.get).toHaveBeenCalledWith('APP_URL');
    });

    it('should throw an error if sending email fails', async () => {
      const email = 'test@example.com';
      const token = 'test-token';
      const firstName = 'John';

      mailerService.sendMail.mockRejectedValueOnce(new Error('Failed to send email'));

      await expect(service.sendVerificationEmail(email, token, firstName))
        .rejects.toThrow('Failed to send email');
    });

    it('should use the correct configuration', async () => {
      const email = 'test@example.com';
      const token = 'test-token';
      const firstName = 'John';

      await service.sendVerificationEmail(email, token, firstName);

      expect(configService.get).toHaveBeenCalledWith('APP_URL');
      expect(mailerService.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: email,
        subject: 'Vérification de votre adresse email',
        html: expect.stringContaining(firstName),
      }));
    });
  });
});