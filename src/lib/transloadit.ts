

const getTransloaditCredentials = () => {
  const authKey = import.meta.env.TRANSLOADIT_KEY;
  const authSecret = import.meta.env.TRANSLOADIT_SECRET;

  if (!authKey || !authSecret) {
    throw new Error(
      'Transloadit credentials not configured. Please add TRANSLOADIT_KEY and TRANSLOADIT_SECRET to your .env file.'
    );
  }

  return { authKey, authSecret };
};

// Generate signature for Transloadit API
import { hmac } from "@noble/hashes/hmac";
import { sha1 } from "@noble/hashes/sha1";
import { utf8ToBytes } from "@noble/hashes/utils";

function toHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateSignature(params: any, secret: string): string {
  const jsonParams = JSON.stringify(params);

  const keyBytes = utf8ToBytes(secret);
  const msgBytes = utf8ToBytes(jsonParams);

  const sigBytes = hmac(sha1, keyBytes, msgBytes);

  return toHex(sigBytes);
}

export async function createAssemblyWithFile(file: File) {
  const creds = getTransloaditCredentials();

  console.log('Creating Transloadit assembly via REST API...');
  console.log('File:', file.name, 'Size:', file.size, 'bytes');

  // Create assembly parameters
  const params = {
    auth: {
      key: creds.authKey,
      expires: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    },
    steps: {
      ':original': {
        robot: '/upload/handle',
      },
      encoded: {
        use: ':original',
        robot: '/video/encode',
        preset: 'ipad-high',
        ffmpeg_stack: 'v6.0.0',
        ffmpeg: {
          f: 'mp4',
          vcodec: 'libx264',
          preset: 'medium',
          crf: '23',
          movflags: '+faststart',
          pix_fmt: 'yuv420p',
        },
      },
    },
  };

  // Generate signature
  const signature = generateSignature(params, creds.authSecret);

  try {
    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append('params', JSON.stringify(params));
    formData.append('signature', signature);
    formData.append('video', file);

    // Send to Transloadit
    const response = await fetch('https://api2.transloadit.com/assemblies', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Transloadit API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Transloadit assembly created:', result.assembly_id);
    
    return result;
  } catch (error: any) {
    console.error('❌ Transloadit REST API error:', error);
    throw new Error(`Transloadit error: ${error.message}`);
  }
}

export async function getAssemblyStatus(assemblyId: string) {
  const creds = getTransloaditCredentials();

  try {
    const url = `https://api2.transloadit.com/assemblies/${assemblyId}`;
    
    const params = {
      auth: {
        key: creds.authKey,
        expires: new Date(Date.now() + 3600000).toISOString(),
      },
    };

    const signature = generateSignature(params, creds.authSecret);

    const response = await fetch(`${url}?signature=${signature}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get assembly status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Failed to get assembly status:', error);
    throw new Error(`Transloadit status error: ${error.message}`);
  }
}


