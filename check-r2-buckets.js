import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

try {
  const command = new ListBucketsCommand({});
  const response = await client.send(command);
  
  console.log('✅ Successfully connected to R2!');
  console.log('\n📦 Your R2 Buckets:');
  
  if (response.Buckets && response.Buckets.length > 0) {
    response.Buckets.forEach((bucket, index) => {
      console.log(`${index + 1}. ${bucket.Name}`);
    });
  } else {
    console.log('❌ No buckets found!');
    console.log('\nYou need to create a bucket first.');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
