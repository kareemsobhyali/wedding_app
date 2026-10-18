import { Injectable, Inject } from '@nestjs/common';
import { StorageInterface, HeadObjectResult } from './storage.interface';

export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';

@Injectable()
export class StorageService implements StorageInterface {
  constructor(@Inject(STORAGE_PROVIDER) private readonly provider: StorageInterface) {}

  getPresignedUploadUrl(key: string, contentType: string, contentLength: number, expiresInSeconds?: number): Promise<string> {
    return this.provider.getPresignedUploadUrl(key, contentType, contentLength, expiresInSeconds);
  }

  getPresignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string> {
    return this.provider.getPresignedDownloadUrl(key, expiresInSeconds);
  }

  getPublicUrl(key: string): string {
    return this.provider.getPublicUrl(key);
  }

  deleteObject(key: string): Promise<void> {
    return this.provider.deleteObject(key);
  }

  headObject(key: string): Promise<HeadObjectResult> {
    return this.provider.headObject(key);
  }

  copyObject(sourceKey: string, destinationKey: string): Promise<void> {
    return this.provider.copyObject(sourceKey, destinationKey);
  }
}
