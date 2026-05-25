/**
 * Cloudflare R2 helper (NO AWS SDK version)
 */

export class R2Client {
  private accountId: string;
  private bucketName: string;
  private publicUrl: string;

  constructor(accountId: string, bucketName: string, publicUrl: string) {
    this.accountId = accountId;
    this.bucketName = bucketName;
    this.publicUrl = publicUrl;
  }

  /**
   * Upload file directly to R2 using HTTP PUT
   */
  async uploadFile(
    file: Buffer | Uint8Array,
    key: string,
    contentType: string
  ): Promise<string> {
    const uploadUrl = `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucketName}/${key}`;

    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: file,
    });

    if (!res.ok) {
      throw new Error(`R2 upload failed: ${res.statusText}`);
    }

    return `${this.publicUrl}/${key}`;
  }

  /**
   * Generate unique file key
   */
  generateUniqueKey(originalFilename: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);

    const extension = originalFilename.split(".").pop();
    const base = originalFilename
      .split(".")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .substring(0, 50);

    return `videos/${timestamp}-${random}-${base}.${extension}`;
  }
}

/**
 * Factory
 */
export function createR2Client(locals?: any): R2Client {
  const accountId =
    locals?.runtime?.env?.CLOUDFLARE_ACCOUNT_ID ||
    import.meta.env.CLOUDFLARE_ACCOUNT_ID;

  const bucketName =
    locals?.runtime?.env?.R2_BUCKET_NAME ||
    import.meta.env.R2_BUCKET_NAME;

  const publicUrl =
    locals?.runtime?.env?.R2_PUBLIC_URL ||
    "https://pub-05fd648bde18471d96916d91334d69f0.r2.dev";

  if (!accountId || !bucketName) {
    throw new Error("Missing R2 configuration");
  }

  return new R2Client(accountId, bucketName, publicUrl);
}

/**
 * Upload helper for Astro API routes
 */
export async function uploadToR2(file: File, locals?: any): Promise<string> {
  const client = createR2Client(locals);

  const buffer = new Uint8Array(await file.arrayBuffer());
  const key = client.generateUniqueKey(file.name);

  return await client.uploadFile(buffer, key, file.type);
}