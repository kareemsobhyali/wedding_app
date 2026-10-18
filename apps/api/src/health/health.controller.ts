import { Controller, Get, HttpCode } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Liveness probe' })
  checkLiveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe' })
  async checkReadiness() {
    let dbStatus = 'down';
    try {
      // Execute a simple query to ensure DB is responsive
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'up';
    } catch (error) {
      dbStatus = 'down';
      // In a real readiness probe, returning 503 is standard if dependencies are down
      // But we will return 200 with status for now so the load balancer can decide.
    }

    return {
      status: dbStatus === 'up' ? 'ok' : 'error',
      database: dbStatus,
      timestamp: new Date().toISOString(),
    };
  }
}
