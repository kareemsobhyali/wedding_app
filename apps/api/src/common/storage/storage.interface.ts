export interface HeadObjectResult {
  exists: boolean;
  contentLength?: number;
  contentType?: string;
}

export interface StorageInterface {
  /**
   * Generates a short-lived presigned URL for direct uploads to storage.
   */
  getPresignedUploadUrl(key: string, contentType: string, contentLength: number, expiresInSeconds?: number): Promise<string>;

  /**
   * Generates a short-lived signed URL to securely download a private object.
   */
  getPresignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Generates a permanent public URL if the storage bucket exposes one.
   * Does NOT check if the object actually exists or is accessible.
   */
  getPublicUrl(key: string): string;

  /**
   * Deletes an object from storage.
   */
  deleteObject(key: string): Promise<void>;

  /**
   * Inspects the object to retrieve metadata without downloading it.
   */
  headObject(key: string): Promise<HeadObjectResult>;

  /**
   * Copies an object from one key to another within the same storage bucket.
   */
  copyObject(sourceKey: string, destinationKey: string): Promise<void>;
}
