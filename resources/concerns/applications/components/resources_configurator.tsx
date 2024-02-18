import { IconCpu } from '@tabler/icons-react'
import React from 'react'
import resourcesConfiguration from '@/constants/resources_configuration'
import type { useForm } from '@inertiajs/react'

export interface ResourcesConfiguratorProps {
  form: ReturnType<
    typeof useForm<{
      cpu: string
      ram: string
    }>
  >
}

export default function ResourcesConfigurator({ form }: ResourcesConfiguratorProps) {
  return (
    <div className="space-y-3">
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
            max={resourcesConfiguration.length - 1}
            step="1"
            value={form.data.cpu}
            onChange={(e) => {
              const cpuIndex = parseInt(e.target.value)
              if (resourcesConfiguration[cpuIndex].ram.length === form.data.ram) {
                setRAM(resourcesConfiguration[cpuIndex].ram.length - 1)
              }
              setCPU(cpuIndex)
            }}
          />
        </div>

        <p className="text-center !text-sm">
          {resourcesConfiguration.find((config) => config.cpu === form.data.cpu)?.cpu}
        </p>
      </div>

      <div>
        <label
          className="font-medium text-dark-100 flex items-center space-x-2 text-sm"
          htmlFor="ramRange"
        >
          RAM Configuration
        </label>

        <div className="flex items-center space-x-2 mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-blue-600 lucide lucide-memory-stick"
          >
            <path d="M6 19v-3" />
            <path d="M10 19v-3" />
            <path d="M14 19v-3" />
            <path d="M18 19v-3" />
            <path d="M8 11V9" />
            <path d="M16 11V9" />
            <path d="M12 11V9" />
            <path d="M2 15h20" />
            <path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z" />
          </svg>
          <input
            className="w-full h-2 rounded-lg appearance-none border border-1 border-sky-200/10 cursor-pointer bg-zinc-700 accent-blue-600"
            type="range"
            id="ramRange"
            min="0"
            step="1"
            value={form.data.ram}
            onChange={(e) => form.setData('ram', e.target.value)}
          />
        </div>

        <p className="text-center text-sm">{form.data.ram}</p>
      </div>
    </div>
  )
}
