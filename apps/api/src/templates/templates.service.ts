import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveTemplates() {
    // Only fetch templates that are administratively active.
    // The frontend registry will further filter out any that lack an implementation.
    const templates = await this.prisma.template.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        thumbnail: true,
        config: true,
      }
    });

    return templates;
  }
}
