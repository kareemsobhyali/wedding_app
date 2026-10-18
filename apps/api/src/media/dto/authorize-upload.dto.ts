import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { MediaType, MediaRole } from '@prisma/client';

export class AuthorizeUploadDto {
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

  @IsString()
  @IsNotEmpty()
  mimeType!: string;

  @IsInt()
  @Min(1)
  @Max(25 * 1024 * 1024) // 25 MB max (handled more specifically in service)
  sizeBytes!: number;
}
