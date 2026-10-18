import { Controller, Get, Patch, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { AdminInvitationsService } from './admin-invitations.service';

@ApiTags('Admin Invitations')
@Controller('admin/invitations')
@UseGuards(AdminAuthGuard)
@ApiCookieAuth('admin_session')
export class AdminInvitationsController {
  constructor(private readonly svc: AdminInvitationsService) {}
  
  @Get()
  async getInvitations(@Query() query: any) {
    return this.svc.getInvitations(query);
  }

  @Get(':id')
  async getDetails(@Param('id') id: string) {
    return this.svc.getInvitationDetails(id);
  }

  @Post()
  async createQuick(@Body() body: any, @Request() req: any) {
    return this.svc.createQuick(req.user.id, body);
  }

  @Patch(':id')
  async updateInvitation(
    @Param('id') id: string, 
    @Body() body: any,
    @Request() req: any
  ) {
    const adminId = req.user.id; // extracted from AdminAuthGuard payload
    return this.svc.updateInvitation(id, adminId, body.version, body);
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string, @Request() req: any) {
    return this.svc.activate(id, req.user.id);
  }

  @Post(':id/disable')
  async disable(@Param('id') id: string, @Request() req: any) {
    return this.svc.disable(id, req.user.id);
  }

  @Post(':id/expire')
  async expire(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    // We update expiration using updateInvitation, then expire immediately? 
    // The requirement is POST /expire, POST /archive, POST /restore.
    // Expire means setting expiresAt to now() or past.
    return this.svc.updateInvitation(id, req.user.id, body.version, { expiresAt: new Date() });
  }

  @Post(':id/archive')
  async archive(@Param('id') id: string, @Request() req: any) {
    return this.svc.archive(id, req.user.id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string, @Request() req: any) {
    return this.svc.restore(id, req.user.id);
  }

  @Post(':id/delete')
  async softDelete(@Param('id') id: string, @Request() req: any) {
    return this.svc.softDelete(id, req.user.id);
  }

  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string, @Request() req: any) {
    return this.svc.duplicate(id, req.user.id);
  }

  @Patch(':id/slug')
  async updateSlug(@Param('id') id: string, @Body('slug') slug: string, @Request() req: any) {
    return this.svc.updateSlug(id, req.user.id, slug);
  }

  @Get(':id/audit')
  async getAuditLogs(@Param('id') id: string, @Query('page') page: string) {
    return this.svc.getAuditLogs(id, parseInt(page, 10) || 1);
  }
}
