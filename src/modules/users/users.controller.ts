import { Controller, Get, Put, Body, UseGuards, Request, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/profile.dto';
import { User } from '../auth/entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil récupéré avec succès', type: User })
  async getProfile(@Request() req): Promise<User> {
    return this.usersService.findById(req.user.sub);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Mettre à jour le profil de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil mis à jour avec succès', type: User })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<User> {
    return this.usersService.updateProfile(req.user.sub, updateProfileDto);
  }

  @Put('signature')
  @UseInterceptors(FileInterceptor('signature'))
  @ApiOperation({ summary: 'Mettre à jour la signature de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Signature mise à jour avec succès', type: User })
  async updateSignature(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }), // 1MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    ) file: Express.Multer.File,
  ): Promise<User> {
    // TODO: Implémenter le stockage du fichier
    const signaturePath = `/uploads/signatures/${file.filename}`;
    return this.usersService.updateSignature(req.user.sub, signaturePath);
  }
} 