import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ required: false, description: 'Prénom de l\'utilisateur' })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ required: false, description: 'Nom de l\'utilisateur' })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ required: false, description: 'Numéro de téléphone' })
  @IsOptional()
  @IsString()
  @Matches(/^(\+33|0)[1-9](\d{8}|\d{2}\s\d{2}\s\d{2}\s\d{2})$/, {
    message: 'Le numéro de téléphone doit être au format français'
  })
  phone?: string;
} 