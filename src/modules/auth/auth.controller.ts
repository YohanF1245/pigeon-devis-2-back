import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { EmailVerificationService } from './services/email-verification.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    try {
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      return this.authService.login({
        user_id: user.user_id,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Une erreur est survenue lors de la connexion');
    }
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Inscription utilisateur' })
  @ApiResponse({ status: 201, description: 'Inscription réussie' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async register(@Body() registerDto: RegisterDto): Promise<{ message: string }> {
    const user = await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.firstName,
      registerDto.lastName
    );
    
    // Envoyer l'email de vérification
    await this.emailVerificationService.createVerification(user);
    
    return { message: 'Inscription réussie. Veuillez vérifier votre email.' };
  }

  @Public()
  @Get('verify-email/:token')
  @ApiOperation({ summary: 'Vérification de l\'email' })
  @ApiResponse({ status: 200, description: 'Email vérifié avec succès' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expiré' })
  async verifyEmail(@Param('token') token: string): Promise<{ message: string }> {
    await this.emailVerificationService.verifyEmail(token);
    return { message: 'Email vérifié avec succès' };
  }
}
