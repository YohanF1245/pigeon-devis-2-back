import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EmailVerification } from '../entities/email-verification.entity';
import { User } from '../entities/user.entity';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async createVerification(user: User): Promise<void> {
    // Supprimer les anciennes vérifications
    await this.emailVerificationRepository.delete({ user_id: user.user_id });

    // Créer un nouveau token
    const token = uuidv4();
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 24); // Expire dans 24h

    // Sauvegarder le token
    const verification = this.emailVerificationRepository.create({
      token,
      expires_at,
      user_id: user.user_id,
    });
    await this.emailVerificationRepository.save(verification);

    // Envoyer l'email
    await this.mailService.sendVerificationEmail(user.email, token, user.first_name);
  }

  async verifyEmail(token: string): Promise<void> {
    const verification = await this.emailVerificationRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!verification) {
      throw new NotFoundException('Token de vérification invalide');
    }

    if (verification.expires_at < new Date()) {
      await this.emailVerificationRepository.remove(verification);
      throw new BadRequestException('Le token de vérification a expiré');
    }

    // Marquer l'utilisateur comme vérifié
    verification.user.is_verified = true;
    await this.userRepository.save(verification.user);

    // Supprimer le token utilisé
    await this.emailVerificationRepository.remove(verification);
  }
} 