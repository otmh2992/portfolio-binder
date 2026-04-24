import type { APIRoute } from 'astro';
import { createR2Client } from '../../lib/r2';

export const GET: APIRoute = async ({ locals }) => {
  const checks: any = {
    timestamp: new Date().toISOString(),
    environment: {},
    r2Config: {},
    status: 'unknown',
  };

  try {
    // Check environment variables
    const accountId = locals?.runtime?.env?.CLOUDFLARE_ACCOUNT_ID || import.meta.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = locals?.runtime?.env?.R2_ACCESS_KEY_ID || import.meta.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = locals?.runtime?.env?.R2_SECRET_ACCESS_KEY || import.meta.env.R2_SECRET_ACCESS_KEY;
    const bucketName = locals?.runtime?.env?.R2_BUCKET_NAME || import.meta.env.R2_BUCKET_NAME;
    const publicUrl = locals?.runtime?.env?.R2_PUBLIC_URL || import.meta.env.R2_PUBLIC_URL;

    checks.environment = {
      CLOUDFLARE_ACCOUNT_ID: accountId ? '✅ Set (' + accountId.substring(0, 8) + '...)' : '❌ Missing',
      R2_ACCESS_KEY_ID: accessKeyId ? '✅ Set (' + accessKeyId.substring(0, 8) + '...)' : '❌ Missing',
      R2_SECRET_ACCESS_KEY: secretAccessKey ? '✅ Set (hidden)' : '❌ Missing',
      R2_BUCKET_NAME: bucketName ? '✅ Set (' + bucketName + ')' : '❌ Missing',
      R2_PUBLIC_URL: publicUrl ? '✅ Set (' + publicUrl + ')' : '❌ Missing',
    };

    // Try to create R2 client
    try {
      const r2Client = createR2Client(locals);
      checks.r2Config.clientCreated = '✅ R2 client created successfully';
      
      // Test key generation
      const testKey = r2Client.generateUniqueKey('test-video.mp4');
      checks.r2Config.keyGeneration = '✅ Key generation works: ' + testKey;
      
      checks.status = 'ready';
    } catch (error: any) {
      checks.r2Config.error = '❌ Failed to create R2 client: ' + error.message;
      checks.status = 'error';
    }

  } catch (error: any) {
    checks.error = error.message;
    checks.stack = error.stack;
    checks.status = 'failed';
  }

  return new Response(JSON.stringify(checks, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
