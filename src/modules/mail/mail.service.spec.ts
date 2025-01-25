import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import * as fs from 'fs';
import { vi } from 'vitest';
import * as path from 'path';

vi.mock('fs', () => ({
  readFileSync: vi.fn()
}));

describe('MailService', () => {
  let service: MailService;
  let mockMailerService: { sendMail: any };
  let mockConfigService: { get: any };

  const mockTemplate = `
    <html>
      <body>
        <h1>Bonjour {{firstName}}</h1>
        <p>Cliquez sur ce lien pour vérifier votre email: {{verificationLink}}</p>
      </body>
    </html>
  `;

  beforeEach(async () => {
    mockMailerService = {
      sendMail: vi.fn()
    };

    mockConfigService = {
      get: vi.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MailerService,
          useValue: mockMailerService
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        },
        {
          provide: MailService,
          useFactory: () => new MailService(mockMailerService as MailerService, mockConfigService as ConfigService)
        }
      ],
    }).compile();

    service = module.get<MailService>(MailService);

    vi.clearAllMocks();
  });

  describe('sendVerificationEmail', () => {
    const email = 'test@example.com';
    const token = 'test-token';
    const firstName = 'Test';
    const baseUrl = 'http://localhost:3000';
    const verificationLink = `${baseUrl}/api/auth/verify-email/${token}`;

    beforeEach(() => {
      mockConfigService.get.mockReturnValue(baseUrl);
      (fs.readFileSync as any).mockReturnValue(mockTemplate);
    });

    it('devrait envoyer un email de vérification avec les bonnes données', async () => {
      mockMailerService.sendMail.mockResolvedValue(undefined);

      await service.sendVerificationEmail(email, token, firstName);

      const expectedHtml = mockTemplate
        .replace(/{{firstName}}/g, firstName)
        .replace(/{{verificationLink}}/g, verificationLink);

      expect(mockConfigService.get).toHaveBeenCalledWith('APP_URL');
      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('/src/modules/mail/templates/email-verification.hbs'),
        'utf8'
      );
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'Vérification de votre adresse email',
        html: expectedHtml
      });
    });

    it('devrait propager les erreurs du service de mail', async () => {
      const error = new Error('Erreur d\'envoi d\'email');
      mockMailerService.sendMail.mockRejectedValue(error);

      await expect(
        service.sendVerificationEmail(email, token, firstName)
      ).rejects.toThrow('Erreur d\'envoi d\'email');
    });

    it('devrait propager les erreurs de lecture du template', async () => {
      const error = new Error('Erreur de lecture du fichier');
      (fs.readFileSync as any).mockImplementation(() => {
        throw error;
      });

      await expect(
        service.sendVerificationEmail(email, token, firstName)
      ).rejects.toThrow('Erreur de lecture du fichier');
    });
  });
});
