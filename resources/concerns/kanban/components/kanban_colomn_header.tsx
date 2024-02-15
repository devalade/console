import React from 'react'
import { Badge } from '@/components/badge'
import { IconDots } from '@tabler/icons-react'

export function ColumnHeader(props: { columnName: string; countTask: number }) {
  const { columnName, countTask } = props
  return (
    <div className="flex items-center justify-between mb-4 py-4 border-b-2 border-gray-500">
      <div className="flex items-center gap-x-2">
        <p className="text-sm font-medium ">{columnName}</p>
        <Badge variant="outline">{countTask}</Badge>
      </div>
      <IconDots className="size-4 stroke-gray-500" />
    </div>
  )
}
