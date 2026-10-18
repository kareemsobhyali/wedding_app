import { Module } from '@nestjs/common';
import { AdminInvitationsController } from './invitations.controller';
import { PublicInvitationsController } from './public-invitations.controller';
import { DashboardController } from './dashboard.controller';
import { PublicInvitationsService } from './public-invitations.service';
import { AdminInvitationsService } from './admin-invitations.service';
import { InvitationPublishValidator } from './invitation-publish.validator';
import { StorageModule } from '../common/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [AdminInvitationsController, PublicInvitationsController, DashboardController],
  providers: [PublicInvitationsService, AdminInvitationsService, InvitationPublishValidator]
})
export class InvitationsModule {}
