import React, { useEffect } from 'react'
import { Highlight, Prism, themes } from 'prism-react-renderer'
import type { StorageBucket } from '../types/storage_bucket'

export type StorageBucketCodeBlockProps = {
  storageBucket: StorageBucket
}

export default function StorageBucketCodeBlock({ storageBucket }: StorageBucketCodeBlockProps) {
  const [loaded, setLoaded] = React.useState(false)
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
      language: 'python',
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
      language: 'php',
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

  useEffect(() => {
    async function loadPrism() {
      await import('prismjs/components/prism-bash')
      await import('prismjs/components/prism-markup-templating')
      await import('prismjs/components/prism-php')
      setLoaded(true)
    }
    loadPrism()
  }, [])

  if (!loaded) {
    return null
  }

  return (
    <div className="mt-6 shadow-lg overflow-hidden">
      <div className="flex space-x-4 items-center bg-black/80 px-4 rounded-t-lg outline-b outline-zinc-600">
        {snippetsList.map((snippet) => (
          <button
            key={snippet.title}
            className={`text-sm py-3 ${
              selectedSnippet.title === snippet.title
                ? 'text-blue-200 border-b border-blue-200'
                : 'text-zinc-300'
            }`}
            onClick={() => setSelectedSnippet(snippet)}
          >
            {snippet.title}
          </button>
        ))}
      </div>
      <Highlight
        theme={themes.vsDark}
        code={selectedSnippet.code}
        language={selectedSnippet.language}
      >
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            style={style}
            className="rounded-b-lg overflow-x-auto p-4 !text-sm max-h-96 overflow-y-auto"
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
