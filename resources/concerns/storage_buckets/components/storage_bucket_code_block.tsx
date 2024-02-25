import React from 'react'
import type { StorageBucket } from '../types/storage_bucket'
import Code from '@/components/code'

export type StorageBucketCodeBlockProps = {
  storageBucket: StorageBucket
}

export default function StorageBucketCodeBlock({ storageBucket }: StorageBucketCodeBlockProps) {
  const snippetsList: Array<{
    title: string
    language: string
    code: string
  }> = [
    {
      title: 'AWS CLI',
      language: 'bash',
      code: `# Install AWS CLI, if not already installed\ncurl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"\nunzip awscliv2.zip\nsudo ./aws/install\n\n# Set the S3 credentials\naws configure set aws_access_key_id ${storageBucket.keyId}\naws configure set aws_secret_access_key ${storageBucket.secretKey}\naws configure set default.region us-east-1\n\n# Upload the file to the specified bucket\naws --endpoint-url=${storageBucket.host} s3 cp <some_file> s3://${storageBucket.slug}`,
    },
    {
      title: 'Node.js',
      language: 'javascript',
      code: `import {
  S3Client,
  ListObjectsCommand,
} from '@aws-sdk/client-s3'

const client = new S3Client({
  endpoint: '${storageBucket.host}',
  region: 'us-east-1',
  credentials: {
    accessKeyId: '${storageBucket.keyId}',
    secretAccessKey: '${storageBucket.secretKey}',
  },
})

const command = new ListObjectsCommand({
  Bucket: '${storageBucket.slug}',
})

const response = await client.send(command)

console.log(response.Contents)`,
    },
    {
      title: 'Python',
      language: 'Python',
      code: `import boto3

storage_bucket_key_id = '${storageBucket.keyId}'
storage_bucket_secret_key = '${storageBucket.secretKey}'
storage_bucket_slug = '${storageBucket.slug}'
s3_endpoint = '${storageBucket.host}'
region = 'us-east-1'

s3_client = boto3.client('s3',
                        endpoint_url=s3_endpoint,
                        aws_access_key_id=storage_bucket_key_id,
                        aws_secret_access_key=storage_bucket_secret_key,
                        region_name=region)

response = s3_client.list_objects(Bucket=storage_bucket_slug)

print(response['Contents'])`,
    },
    {
      title: 'PHP',
      language: 'PHP',
      code: `<?php

require 'vendor/autoload.php';

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

$storageBucketKeyId = '${storageBucket.keyId}';
$storageBucketSecretKey = '${storageBucket.secretKey}';
$storageBucketSlug = '${storageBucket.slug}';
$s3Endpoint = '${storageBucket.host}';
$region = 'us-east-1';

$s3Client = new S3Client([
    'version'     => 'latest',
    'region'      => $region,
    'endpoint'    => $s3Endpoint,
    'credentials' => [
        'key'    => $storageBucketKeyId,
        'secret' => $storageBucketSecretKey,
    ],
]);

try {
    $result = $s3Client->listObjects([
        'Bucket' => $storageBucketSlug,
    ]);

    print_r($result['Contents']);
} catch (AwsException $e) {
    echo "Error: " . $e->getAwsErrorMessage() . "\\n";
}`,
    },
  ]
  const [selectedSnippet, setSelectedSnippet] = React.useState(snippetsList[0])

  return (
    <Code
      runtimes={snippetsList.map((snippet, idx) => snippet.title)}
      codeString={selectedSnippet.code}
      selectedRuntime={selectedSnippet.title}
      setSelectedRuntime={(runtime) =>
        setSelectedSnippet(snippetsList.find((snippet) => snippet.title === runtime)!)
      }
      className="mt-6"
    />
  )
}
