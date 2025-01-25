import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { EmailVerificationService } from './services/email-verification.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, EmailVerification]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService, EmailVerificationService],
  exports: [AuthService],
})
export class AuthModule {}
