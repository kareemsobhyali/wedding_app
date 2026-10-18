import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { MediaType, MediaRole } from '@prisma/client';

export class FinalizeUploadDto {
  @IsString()
  @IsNotEmpty()
  storageKey!: string;

  @IsString()
  @IsNotEmpty()
  invitationId!: string;

  @IsEnum(MediaType)
  type!: MediaType;

  @IsEnum(MediaRole)
  role!: MediaRole;

  @IsString()
  @IsNotEmpty()
  filename!: string;
}
