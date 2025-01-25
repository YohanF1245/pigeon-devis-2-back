import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    console.log(`[AuthService] Tentative de validation pour l'email: ${email}`);
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      console.log(`[AuthService] Utilisateur non trouvé pour l'email: ${email}`);
      throw new UnauthorizedException('Identifiants invalides');
    }

    console.log(`[AuthService] Utilisateur trouvé, vérification du mot de passe`);
    console.log(`[AuthService] Mot de passe fourni:`, password);
    console.log(`[AuthService] Hash stocké:`, user.password);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`[AuthService] Résultat de la validation du mot de passe:`, isPasswordValid);

    if (!isPasswordValid) {
      console.log(`[AuthService] Mot de passe invalide pour l'email: ${email}`);
      throw new UnauthorizedException('Identifiants invalides');
    }

    console.log(`[AuthService] Authentification réussie pour l'email: ${email}`);
    return user;
  }

  async login(user: { user_id: string; email: string; role: string }): Promise<{ access_token: string }> {
    console.log('Génération du token pour:', { ...user, user_id: '[HIDDEN]' });
    const payload: JwtPayload = {
      sub: user.user_id,
      email: user.email,
      role: user.role
    };

    const token = this.jwtService.sign(payload);
    console.log('Token généré avec succès');
    return {
      access_token: token,
    };
  }

  async register(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    console.log('Début de l\'inscription pour:', email);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await this.userService.create({
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
    });
    console.log('Inscription terminée avec succès');
    return user;
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      console.log('Validation du token');
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      console.log('Token validé pour:', payload.email);
      return payload;
    } catch (error) {
      console.log('Erreur de validation du token:', error.message);
      throw new UnauthorizedException('Token invalide');
    }
  }
}
