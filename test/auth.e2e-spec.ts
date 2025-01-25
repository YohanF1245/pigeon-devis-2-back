import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/modules/auth/entities/user.entity';
import { EmailVerification } from '../src/modules/auth/entities/email-verification.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let emailVerificationRepository: Repository<EmailVerification>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    emailVerificationRepository = moduleFixture.get<Repository<EmailVerification>>(
      getRepositoryToken(EmailVerification)
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await emailVerificationRepository.clear();
    await userRepository.clear();
  });

  describe('/auth', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'Password123!',
      first_name: 'Test',
      last_name: 'User'
    };

    describe('POST /register', () => {
      it('devrait créer un nouvel utilisateur et envoyer un email de vérification', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send(testUser)
          .expect(201);

        expect(response.body).toHaveProperty('user_id');
        expect(response.body.email).toBe(testUser.email);
        expect(response.body.is_email_verified).toBe(false);

        const verificationRecord = await emailVerificationRepository.findOne({
          where: { user_id: response.body.user_id }
        });
        expect(verificationRecord).toBeDefined();
        expect(verificationRecord.token).toBeDefined();
      });

      it('devrait rejeter un email déjà utilisé', async () => {
        await request(app.getHttpServer())
          .post('/auth/register')
          .send(testUser)
          .expect(201);

        await request(app.getHttpServer())
          .post('/auth/register')
          .send(testUser)
          .expect(400);
      });
    });

    describe('POST /login', () => {
      beforeEach(async () => {
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        await userRepository.save({
          ...testUser,
          password: hashedPassword,
          is_email_verified: true
        });
      });

      it('devrait authentifier un utilisateur valide et retourner un token', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password
          })
          .expect(200);

        expect(response.body).toHaveProperty('access_token');
      });

      it('devrait rejeter des identifiants invalides', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: 'wrongpassword'
          })
          .expect(401);
      });
    });

    describe('GET /verify-email/:token', () => {
      let verificationToken: string;
      let userId: string;

      beforeEach(async () => {
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        const user = await userRepository.save({
          ...testUser,
          password: hashedPassword,
          is_email_verified: false
        });
        userId = user.user_id;

        const verification = await emailVerificationRepository.save({
          user_id: userId,
          token: 'valid-token',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        verificationToken = verification.token;
      });

      it('devrait vérifier l\'email avec un token valide', async () => {
        await request(app.getHttpServer())
          .get(`/auth/verify-email/${verificationToken}`)
          .expect(200);

        const user = await userRepository.findOne({ where: { user_id: userId } });
        expect(user.is_email_verified).toBe(true);
      });

      it('devrait rejeter un token invalide', async () => {
        await request(app.getHttpServer())
          .get('/auth/verify-email/invalid-token')
          .expect(404);
      });
    });
  });
}); 