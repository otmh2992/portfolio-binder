import type { APIRoute } from 'astro';
import { getAssemblyStatus } from '../../lib/transloadit';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const assemblyId = url.searchParams.get('assemblyId');

    if (!assemblyId) {
      return new Response(JSON.stringify({ error: 'Assembly ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get assembly status from Transloadit
    const assembly = await getAssemblyStatus(assemblyId);

    console.log('Assembly status:', assembly.ok, assembly.error);

    // Check if completed
    if (assembly.ok === 'ASSEMBLY_COMPLETED') {
      // Get the converted video URL
      const encodedStep = assembly.results?.encoded?.[0];
      
      if (!encodedStep || !encodedStep.url) {
        throw new Error('No converted video found in assembly results');
      }

      console.log('Video converted, downloading from:', encodedStep.url);

      // Download the converted video
      const videoResponse = await fetch(encodedStep.url);
      if (!videoResponse.ok) {
        throw new Error('Failed to download converted video');
      }

      const videoBuffer = await videoResponse.arrayBuffer();
      const videoBytes = new Uint8Array(videoBuffer);

      // Upload to R2
      const accountId = locals?.runtime?.env?.CLOUDFLARE_ACCOUNT_ID || import.meta.env.CLOUDFLARE_ACCOUNT_ID;
      const accessKeyId = locals?.runtime?.env?.R2_ACCESS_KEY_ID || import.meta.env.R2_ACCESS_KEY_ID;
      const secretAccessKey = locals?.runtime?.env?.R2_SECRET_ACCESS_KEY || import.meta.env.R2_SECRET_ACCESS_KEY;
      const bucketName = locals?.runtime?.env?.R2_BUCKET_NAME || import.meta.env.R2_BUCKET_NAME;
      const endpoint = locals?.runtime?.env?.R2_ENDPOINT || import.meta.env.R2_ENDPOINT;
      const workerUrl = locals?.runtime?.env?.WORKER_URL || import.meta.env.WORKER_URL;

      if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !endpoint) {
        throw new Error('R2 configuration missing');
      }

      const s3Client = new S3Client({
        region: 'auto',
        endpoint: endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 10);
      const originalName = encodedStep.name || 'video.mp4';
      const fileName = `${timestamp}-${randomStr}-${originalName}`;

      console.log('Uploading converted video to R2:', fileName);

      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: videoBytes,
          ContentType: 'video/mp4',
          ContentDisposition: 'inline',
        })
      );

      // Construct streaming URL using Worker
      const videoUrl = workerUrl 
        ? `${workerUrl}/${fileName}`
        : `${endpoint}/${bucketName}/${fileName}`;

      console.log('Video uploaded successfully:', videoUrl);

      return new Response(
        JSON.stringify({
          status: 'completed',
          url: videoUrl,
          size: videoBytes.length,
          originalSize: assembly.results?.imported?.[0]?.size,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else if (assembly.error) {
      // Assembly failed
      return new Response(
        JSON.stringify({
          status: 'error',
          error: assembly.error || 'Conversion failed',
          message: assembly.message,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      // Still processing
      const percent = assembly.bytes_expected > 0
        ? Math.round((assembly.bytes_received / assembly.bytes_expected) * 100)
        : 0;

      return new Response(
        JSON.stringify({
          status: 'processing',
          progress: percent,
          message: `Converting video... ${percent}%`,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error: any) {
    console.error('Status check error:', error);
    return new Response(
      JSON.stringify({
        status: 'error',
        error: error.message || 'Failed to check conversion status',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
