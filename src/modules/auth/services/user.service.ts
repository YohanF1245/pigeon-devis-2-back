import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    console.log('Recherche utilisateur avec email:', email);
    const user = await this.userRepository.findOne({ where: { email } });
    console.log('Utilisateur trouvé:', user);
    return user;
  }

  async create(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Promise<User> {
    console.log('Création utilisateur avec données:', { ...userData, password: '[HIDDEN]' });
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);
    console.log('Utilisateur créé:', { ...savedUser, password: '[HIDDEN]' });
    return savedUser;
  }
} 