import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageInterface, HeadObjectResult } from '../storage.interface';

@Injectable()
export class R2StorageProvider implements StorageInterface {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly publicUrlBase: string;
  private readonly logger = new Logger(R2StorageProvider.name);

  constructor(private configService: ConfigService) {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');
    
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME') || 'wedding-media';
    this.publicUrlBase = this.configService.get<string>('R2_PUBLIC_URL') || '';

    // Mock client for testing if secrets are missing
    if (!accountId || !accessKeyId || !secretAccessKey) {
      this.logger.warn('R2 credentials missing. Storage provider will fail on live calls.');
    }

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId || 'mock',
        secretAccessKey: secretAccessKey || 'mock',
      },
    });
  }

  async getPresignedUploadUrl(key: string, contentType: string, contentLength: number, expiresInSeconds = 600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      ContentLength: contentLength,
    });

    // Generate URL that strictly enforces Content-Type and Content-Length
    return await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
  }

  async getPresignedDownloadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
  }

  getPublicUrl(key: string): string {
    if (!this.publicUrlBase) return '';
    // Strip trailing slashes from base URL
    const base = this.publicUrlBase.replace(/\/+$/, '');
    return `${base}/${key}`;
  }

  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.s3Client.send(command);
  }

  async headObject(key: string): Promise<HeadObjectResult> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      const response = await this.s3Client.send(command);
      
      return {
        exists: true,
        contentLength: response.ContentLength,
        contentType: response.ContentType,
      };
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return { exists: false };
      }
      throw error;
    }
  }

  async copyObject(sourceKey: string, destinationKey: string): Promise<void> {
    try {
      const { CopyObjectCommand } = await import('@aws-sdk/client-s3');
      const command = new CopyObjectCommand({
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${sourceKey}`,
        Key: destinationKey,
      });
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error(`Failed to copy object ${sourceKey} to ${destinationKey}`, error);
      throw error;
    }
  }
}
