import { Controller, Post, Get, Body, Param, Query, UseGuards, Req, Res } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { Request, Response } from 'express';

@Controller()
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  @Post('public/analytics/events')
  async trackEvent(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body('invitationSlug') slug: string,
    @Body('eventType') eventType: string
  ) {
    // Controller remains thin. The service returns success true/false silently.
    const result = await this.svc.trackEvent(req, res, slug, eventType);
    return result;
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin/analytics/global')
  async getGlobalAnalytics() {
    return this.svc.getAdminAggregates();
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin/invitations/:id/analytics')
  async getInvitationAnalytics(
    @Param('id') id: string,
    @Query('days') days?: string
  ) {
    const daysInt = days ? parseInt(days, 10) : undefined;
    return this.svc.getInvitationAnalytics(id, daysInt);
  }
}
