import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://1df95eb7feda5b3b11847c2fe7781163.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '39132ddd8629877ca545c698b8746c9e',
    secretAccessKey: '8c04cf21a7c8c69c0e281fb3ca49d01b603204430c934c7130871349aeba3e9a',
  },
});

const command = new ListObjectsV2Command({
  Bucket: 'portfoliovideos',
});

try {
  const response = await client.send(command);
  console.log('\n📹 VIDEOS IN YOUR R2 BUCKET:\n');
  
  if (!response.Contents || response.Contents.length === 0) {
    console.log('No videos found in bucket.');
  } else {
    response.Contents.forEach((item, index) => {
      console.log(`${index + 1}. ${item.Key}`);
      console.log(`   Size: ${(item.Size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Worker URL: https://video-streaming.otmh-here.workers.dev/${item.Key}`);
      console.log('');
    });
  }
} catch (error) {
  console.error('Error:', error.message);
}
