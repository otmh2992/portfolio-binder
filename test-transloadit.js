// Quick test of Transloadit credentials
import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';

const TRANSLOADIT_KEY = '0c1caba81852a63cb37fd88a635d952b';
const TRANSLOADIT_SECRET = process.env.TRANSLOADIT_SECRET || 'YOUR_SECRET_HERE';

console.log('Testing Transloadit...');
console.log('Key:', TRANSLOADIT_KEY);
console.log('Secret:', TRANSLOADIT_SECRET ? '✓ Set' : '✗ Missing');

async function testTransloadit() {
  const params = {
    auth: {
      key: TRANSLOADIT_KEY,
      expires: new Date(Date.now() + 3600000).toISOString(),
    },
    steps: {
      ':original': {
        robot: '/upload/handle',
      },
    },
  };

  const paramsJson = JSON.stringify(params);
  console.log('\nParams:', paramsJson);

  // Test just the auth
  const response = await fetch('https://api2.transloadit.com/assemblies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ params: paramsJson }),
  });

  const result = await response.json();
  console.log('\nResponse:', JSON.stringify(result, null, 2));
}

testTransloadit().catch(console.error);
