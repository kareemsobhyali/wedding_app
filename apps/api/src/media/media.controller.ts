import { Controller, Post, Body, UseGuards, Get, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { MediaService } from './media.service';
import { AuthorizeUploadDto } from './dto/authorize-upload.dto';
import { FinalizeUploadDto } from './dto/finalize-upload.dto';

@ApiTags('Admin Media')
@Controller('admin/media')
@UseGuards(AdminAuthGuard)
@ApiCookieAuth('admin_session')
export class AdminMediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Request a presigned URL to upload media to Cloudflare R2' })
  async getUploadUrl(@Body() dto: AuthorizeUploadDto) {
    return this.mediaService.authorizeUpload(dto);
  }

  @Post('finalize')
  @ApiOperation({ summary: 'Finalize an upload after pushing to R2, creating the DB record' })
  async finalizeUpload(@Body() dto: FinalizeUploadDto) {
    return this.mediaService.finalizeUpload(dto);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get a short-lived signed URL to securely download a private media asset' })
  async getDownloadUrl(@Param('id') id: string) {
    const url = await this.mediaService.getMediaUrl(id);
    return { url };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete media' })
  async deleteMedia(@Param('id') id: string) {
    await this.mediaService.softDeleteMedia(id);
    return { message: 'Media deleted' };
  }
}
