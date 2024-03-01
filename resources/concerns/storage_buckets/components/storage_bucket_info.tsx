import * as React from 'react'
import type { StorageBucket } from '../types/storage_bucket'
import { formatFileSize } from '../lib/file_size'
import StorageBucketCodeBlock from './storage_bucket_code_block'

interface StorageBucketInfoProps {
  storageBucket: StorageBucket
  size: number
}

const StorageBucketInfo: React.FunctionComponent<StorageBucketInfoProps> = ({
  storageBucket,
  size,
}) => {
  return (
    <div className="bg-white pb-7 px-12 border-b border-zinc-200">
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 items-end overflow-x-auto">
        <div className="flex flex-col">
          <p className="text-zinc-700 text-sm font-semibold">Status</p>
          <div className="flex space-x-2 items-center mt-1">
            <div>
              <div className="flex-none rounded-full p-1 text-emerald-500 !bg-emerald-100">
                <div className="h-2 w-2 rounded-full bg-current animate-pulse"></div>
              </div>
            </div>
            <p className="text-sm text-zinc-600">Available</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 pt-6">
            <p className="text-zinc-700 text-sm font-semibold">Bucket Size</p>
          </div>
          <div className="flex space-x-2 items-center">
            <p className="text-sm text-zinc-600">{formatFileSize(size)}</p>
          </div>
        </div>
      </div>
      <StorageBucketCodeBlock storageBucket={storageBucket} />
    </div>
  )
}

export default StorageBucketInfo
