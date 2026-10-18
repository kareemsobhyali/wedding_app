import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { AdminInvitationsService } from './admin-invitations.service';

@ApiTags('Admin Dashboard')
@Controller('admin/dashboard')
@UseGuards(AdminAuthGuard)
@ApiCookieAuth('admin_session')
export class DashboardController {
  constructor(private readonly svc: AdminInvitationsService) {}

  @Get('summary')
  async getSummary() {
    return this.svc.getDashboardSummary();
  }
}
