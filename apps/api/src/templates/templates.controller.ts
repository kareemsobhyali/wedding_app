import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@ApiTags('Admin Templates')
@Controller('admin/templates')
@UseGuards(AdminAuthGuard)
@ApiCookieAuth('admin_session')
export class AdminTemplatesController {
  @Get()
  @ApiOperation({ summary: 'Admin template management placeholder' })
  async getTemplates() {
    return []; // Placeholder for future admin management
  }
}

@ApiTags('Public Templates')
@Controller('templates')
export class PublicTemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active templates available for selection' })
  async getTemplates() {
    return this.templatesService.getActiveTemplates();
  }
}
