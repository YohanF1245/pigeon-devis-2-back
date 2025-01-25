import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);
    
    // Mise à jour des champs modifiables
    if (updateProfileDto.first_name) user.first_name = updateProfileDto.first_name;
    if (updateProfileDto.last_name) user.last_name = updateProfileDto.last_name;
    if (updateProfileDto.phone !== undefined) user.phone = updateProfileDto.phone;
    
    return this.userRepository.save(user);
  }

  async updateSignature(userId: string, signaturePath: string): Promise<User> {
    const user = await this.findById(userId);
    user.signature_path = signaturePath;
    return this.userRepository.save(user);
  }
} 