import { IconCpu } from '@tabler/icons-react'
import React from 'react'
import resourcesConfiguration from '@/concerns/applications/constants/resources_configuration'
import type { useForm } from '@inertiajs/react'
import IconRam from '@/components/icon_ram'

export interface ResourcesConfiguratorProps {
  form: ReturnType<
    typeof useForm<{
      cpu: string
      ram: string
    }>
  >
}

export default function ResourcesConfigurator({ form }: ResourcesConfiguratorProps) {
  const [cpuIdx, setCpuIdx] = React.useState(
    Object.keys(resourcesConfiguration).findIndex((cpu) => cpu === form.data.cpu)
  )
  const [ramIdx, setRamIdx] = React.useState(
    Object.values(resourcesConfiguration[form.data.cpu] || {}).findIndex(
      (ram) => ram === form.data.ram
    )
  )

  React.useEffect(() => {
    const cpu = Object.keys(resourcesConfiguration)[cpuIdx]
    const ram = resourcesConfiguration[cpu]?.[ramIdx]
    form.setData((prev) => ({ ...prev, cpu, ram }))
  }, [cpuIdx, ramIdx])

  return (
    <div className="space-y-3 px-6 pb-4">
      <div>
        <label
          className="font-medium text-dark-100 flex items-center space-x-2 !text-sm"
          htmlFor="cpuRange"
        >
          CPU Configuration
        </label>

        <div className="flex items-center space-x-2 mt-1">
          <IconCpu className="w-5 h-5 text-blue-600" />
          <input
            className="w-full h-2 rounded-lg appearance-none border border-1 border-sky-200/10 cursor-pointer bg-zinc-700 accent-blue-600"
            type="range"
            id="cpuRange"
            min="0"
            max={Object.keys(resourcesConfiguration).length - 1}
            step="1"
            value={cpuIdx}
            onChange={(e) => setCpuIdx(parseInt(e.target.value))}
          />
        </div>

        <p className="text-center !text-sm">{Object.keys(resourcesConfiguration)[cpuIdx]}</p>
      </div>

      <div>
        <label
          className="font-medium text-dark-100 flex items-center space-x-2 text-sm"
          htmlFor="ramRange"
        >
          RAM Configuration
        </label>
        <div className="flex items-center space-x-2 mt-1">
          <IconRam />
          <input
            className="w-full h-2 rounded-lg appearance-none border border-1 border-sky-200/10 cursor-pointer bg-zinc-700 accent-blue-600"
            type="range"
            id="ramRange"
            min="0"
            step="1"
            value={ramIdx}
            onChange={(e) => setRamIdx(parseInt(e.target.value))}
            max={
              resourcesConfiguration[Object.keys(resourcesConfiguration)[cpuIdx]]?.length - 1 || 0
            }
          />
        </div>
        <p className="text-center text-sm">
          {resourcesConfiguration[Object.keys(resourcesConfiguration)[cpuIdx]]?.[ramIdx] || '0MB'}
        </p>
      </div>
    </div>
  )
}
