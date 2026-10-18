import { Module } from '@nestjs/common';
import { AdminMediaController } from './media.controller';
import { PublicMediaController } from './public-media.controller';
import { MediaService } from './media.service';

@Module({
  controllers: [AdminMediaController, PublicMediaController],
  providers: [MediaService],
  exports: [MediaService]
})
export class MediaModule {}
