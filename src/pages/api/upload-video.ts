import type { APIRoute } from 'astro';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  try {
    // Check authentication
    const supabaseUrl = locals?.runtime?.env?.SUPABASE_URL || import.meta.env.SUPABASE_URL;
    const supabaseAnonKey = locals?.runtime?.env?.SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(JSON.stringify({ message: 'Missing Supabase configuration' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get auth token from cookies
    const authToken = cookies.get('sb-access-token')?.value;
    
    if (!authToken) {
      return new Response(JSON.stringify({ message: 'Unauthorized. Please log in.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify user with Supabase
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'apikey': supabaseAnonKey,
      },
    });

    if (!userResponse.ok) {
      return new Response(JSON.stringify({ message: 'Invalid authentication' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await userResponse.json();

    // Get request body
    const { filename, contentType, title } = await request.json();

    if (!filename || !contentType || !title) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = filename.split('.').pop();
    const sanitized = filename
      .split('.')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 50);
    
    const uniqueFilename = `${timestamp}-${random}-${sanitized}.${extension}`;
    const videoKey = `videos/${uniqueFilename}`;
    const thumbnailKey = `thumbs/${uniqueFilename.replace(/\.[^/.]+$/, '.jpg')}`;

    // Generate slug from title
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${timestamp}`;

    // Get R2 credentials
    const accountId = locals?.runtime?.env?.CLOUDFLARE_ACCOUNT_ID || import.meta.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = locals?.runtime?.env?.R2_ACCESS_KEY_ID || import.meta.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = locals?.runtime?.env?.R2_SECRET_ACCESS_KEY || import.meta.env.R2_SECRET_ACCESS_KEY;
    const bucketName = locals?.runtime?.env?.R2_BUCKET_NAME || import.meta.env.R2_BUCKET_NAME;
    const publicUrl = locals?.runtime?.env?.R2_PUBLIC_URL || import.meta.env.R2_PUBLIC_URL;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
      return new Response(JSON.stringify({ message: 'Missing R2 configuration' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create S3 client for R2
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Create presigned URL for upload (valid for 1 hour)
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: videoKey,
      ContentType: contentType,
      ContentDisposition: 'inline',
      CacheControl: 'public, max-age=31536000',
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Generate public URLs
    const videoUrl = `${publicUrl}/${videoKey}`;
    const thumbnailUrl = `${publicUrl}/${thumbnailKey}`;

    return new Response(
      JSON.stringify({
        uploadUrl,
        videoUrl,
        thumbnailUrl,
        slug,
        userId: user.id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Upload URL generation error:', error);
    return new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : 'Failed to generate upload URL',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
