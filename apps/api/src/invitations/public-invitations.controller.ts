import { Controller, Post, Get, Patch, Body, UseGuards, Res, Req, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { PublicInvitationsService, StartDraftDto } from './public-invitations.service';
import { DraftAuthGuard } from '../auth/guards/draft-auth.guard';
import { CurrentInvitationId } from '../auth/decorators/draft.decorator';
import { Response, Request } from 'express';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, MaxLength, IsDateString, IsUrl } from 'class-validator';
import { Throttle } from '@nestjs/throttler';

export class CreateDraftRequestDto implements StartDraftDto {
  @IsString()
  @IsNotEmpty()
  templateId!: string;
}

export class PatchDraftDto {
  @IsInt()
  @IsNotEmpty()
  version!: number;

  @IsOptional() @IsString() @MaxLength(100) groomName?: string;
  @IsOptional() @IsString() @MaxLength(100) brideName?: string;
  @IsOptional() @IsDateString() weddingDate?: string;
  @IsOptional() @IsString() @MaxLength(50) weddingTime?: string;
  @IsOptional() @IsString() @MaxLength(200) venueName?: string;
  @IsOptional() @IsString() @MaxLength(500) venueAddress?: string;
  
  @IsOptional() @IsUrl({ protocols: ['https'] }) mapsUrl?: string;
  
  @IsOptional() @IsString() @MaxLength(500) caption?: string;
  @IsOptional() @IsString() @MaxLength(3000) weddingMessage?: string;
  
  @IsOptional() @IsString() @MaxLength(20) groomContact?: string;
  @IsOptional() @IsString() @MaxLength(20) brideContact?: string;
  @IsOptional() @IsString() @MaxLength(20) customerPhone?: string;

  @IsOptional() customData?: any;

  @IsOptional() @IsBoolean() countdownEnabled?: boolean;
}

@ApiTags('Public Invitations')
@Controller('public/invitations')
export class PublicInvitationsController {
  constructor(private readonly svc: PublicInvitationsService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // More restrictive for creating new rows
  @ApiOperation({ summary: 'Start a new draft invitation and receive a secure HttpOnly cookie' })
  async startDraft(@Body() dto: CreateDraftRequestDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.svc.startDraft(dto, res, req.ip, req.headers['user-agent']);
  }

  @Get('draft')
  @UseGuards(DraftAuthGuard)
  @ApiCookieAuth('draft_session')
  @ApiOperation({ summary: 'Recover the current draft utilizing the secure HttpOnly cookie' })
  async getDraft(@CurrentInvitationId() invitationId: string) {
    return this.svc.getDraft(invitationId);
  }

  @Patch('draft')
  @UseGuards(DraftAuthGuard)
  @ApiCookieAuth('draft_session')
  @ApiOperation({ summary: 'Autosave the draft securely' })
  async patchDraft(@CurrentInvitationId() invitationId: string, @Body() dto: PatchDraftDto) {
    const { version, ...updateData } = dto;
    
    // Normalize date conversion securely
    const parsedData: any = { ...updateData };
    if (parsedData.weddingDate) parsedData.weddingDate = new Date(parsedData.weddingDate);

    return this.svc.patchDraft(invitationId, version, parsedData);
  }

  @Post('submit')
  @UseGuards(DraftAuthGuard)
  @ApiCookieAuth('draft_session')
  @ApiOperation({ summary: 'Submit the draft for admin review' })
  async submitDraft(@CurrentInvitationId() invitationId: string, @Res({ passthrough: true }) res: Response) {
    return this.svc.submitDraft(invitationId, res);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a public invitation by slug' })
  async getBySlug(@Param('slug') slug: string) {
    return this.svc.getBySlug(slug);
  }
}
