import * as React from 'react'
import { IconDeviceFloppy } from '@tabler/icons-react'

export type VolumeConfiguratorProps = {
  diskSize: number
  setDiskSize: (diskSize: number) => void
}

export default function VolumeConfigurator({ diskSize, setDiskSize }: VolumeConfiguratorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiskSize(parseInt(event.target.value, 10))
  }

  return (
    <div>
      <div>
        <label
          className="font-medium text-sm text-dark-100 flex items-center space-x-2"
          htmlFor="diskSize"
        >
          <span>Disk Size</span>
        </label>

        <div className="flex items-center space-x-2 mt-1">
          <IconDeviceFloppy className="w-5 h-5 text-blue-600" />
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={diskSize}
            onChange={handleChange}
            className="w-full h-2 rounded-lg appearance-none border border-1 border-sky-200/10 cursor-pointer bg-zinc-700 accent-blue-600"
            name="diskSize"
          />
        </div>
        <div className="text-center text-sm text-dark-100 flex items-center justify-center">
          <span>{diskSize}GB</span>
        </div>
      </div>
    </div>
  )
}
