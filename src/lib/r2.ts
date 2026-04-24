import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * R2 Client for uploading files to Cloudflare R2
 */
export class R2Client {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;
  private workerUrl: string;

  constructor(
    accountId: string,
    accessKeyId: string,
    secretAccessKey: string,
    bucketName: string,
    publicUrl: string,
    workerUrl?: string
  ) {
    this.bucketName = bucketName;
    this.publicUrl = publicUrl;
    this.workerUrl = workerUrl || publicUrl;

    // Create S3 client configured for Cloudflare R2
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  /**
   * Upload a file to R2
   * @param file File buffer or stream
   * @param key Object key (filename) in the bucket
   * @param contentType MIME type of the file
   * @returns Public URL of the uploaded file
   */
  async uploadFile(
    file: Buffer | Uint8Array,
    key: string,
    contentType: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
      ContentDisposition: 'inline', // Stream in browser instead of downloading
      CacheControl: 'public, max-age=31536000', // Cache for 1 year
    });

    await this.s3Client.send(command);

    // Return Worker URL for videos (supports streaming), otherwise public URL
    if (contentType.startsWith('video/')) {
      return `${this.workerUrl}/${key}`;
    }
    
    return `${this.publicUrl}/${key}`;
  }

  /**
   * Generate a unique filename with timestamp
   */
  generateUniqueKey(originalFilename: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalFilename.split('.').pop();
    const sanitized = originalFilename
      .split('.')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 50);
    
    return `${timestamp}-${random}-${sanitized}.${extension}`;
  }
}

/**
 * Create R2 client from environment variables
 */
export function createR2Client(locals?: any): R2Client {
  const accountId =
    locals?.runtime?.env?.CLOUDFLARE_ACCOUNT_ID ||
    import.meta.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId =
    locals?.runtime?.env?.R2_ACCESS_KEY_ID ||
    import.meta.env.R2_ACCESS_KEY_ID;
  const secretAccessKey =
    locals?.runtime?.env?.R2_SECRET_ACCESS_KEY ||
    import.meta.env.R2_SECRET_ACCESS_KEY;
  const bucketName =
    locals?.runtime?.env?.R2_BUCKET_NAME ||
    import.meta.env.R2_BUCKET_NAME;
  const publicUrl =
    locals?.runtime?.env?.R2_PUBLIC_URL ||
    import.meta.env.R2_PUBLIC_URL;
  const workerUrl =
    locals?.runtime?.env?.WORKER_URL ||
    import.meta.env.WORKER_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    throw new Error('Missing R2 configuration. Check your .env file.');
  }

  return new R2Client(accountId, accessKeyId, secretAccessKey, bucketName, publicUrl, workerUrl);
}

/**
 * Upload a File object to R2 (helper function)
 */
export async function uploadToR2(file: File, locals?: any): Promise<string> {
  const client = createR2Client(locals);
  
  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  
  // Generate unique key
  const key = client.generateUniqueKey(file.name);
  
  // Upload and return URL
  return await client.uploadFile(buffer, key, file.type);
}




