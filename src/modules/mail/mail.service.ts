import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(email: string, token: string, firstName: string): Promise<void> {
    const baseUrl = this.configService.get<string>('APP_URL');
    const verificationLink = `${baseUrl}/api/auth/verify-email/${token}`;

    // Lire le template directement
    const templatePath = process.cwd() + '/src/modules/mail/templates/email-verification.hbs';
    const template = fs.readFileSync(templatePath, 'utf8');

    // Remplacer les variables dans le template
    const html = template
      .replace(/{{firstName}}/g, firstName)
      .replace(/{{verificationLink}}/g, verificationLink);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Vérification de votre adresse email',
      html: html,
    });
  }
} 