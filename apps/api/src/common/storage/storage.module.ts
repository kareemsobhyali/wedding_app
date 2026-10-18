import { Global, Module } from '@nestjs/common';
import { StorageService, STORAGE_PROVIDER } from './storage.service';
import { R2StorageProvider } from './providers/r2.storage';

@Global()
@Module({
  providers: [
    {
      provide: STORAGE_PROVIDER,
      useClass: R2StorageProvider, // Abstracting the actual provider implementation
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
