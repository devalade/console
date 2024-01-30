import CopyToClipboard from '@/components/copy_to_clipboard'
import Input from '@/components/input'
import React from 'react'

const DnsEntry = ({ type, name, value }) => {
  return (
    <div className="flex mt-4 items-center space-x-8">
      <div className="flex items-start w-1/2">
        <div className="flex !w-full">
          <span className="bg-zinc-900 text-white py-1.5 px-4 text-sm rounded-l border-r-0 border-blue-200/20 border duration-200 flex items-center justify-center">
            {type}
          </span>
          <Input
            className="!w-full !rounded-l-none !rounded-r-none !text-zinc-700"
            value={name}
            readOnly
          />
          <CopyToClipboard value={name} />
        </div>
      </div>

      <span>→</span>

      <div className="flex items-start w-1/2">
        <div className="flex !w-full">
          <Input className="!w-full !rounded-r-none !text-zinc-700" value={value} readOnly />
          <CopyToClipboard value={value} />
        </div>
      </div>
    </div>
  )
}

export default DnsEntry
