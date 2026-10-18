import { Module } from '@nestjs/common';
import { AdminTemplatesController, PublicTemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminTemplatesController, PublicTemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
