import React, { useRef, type ElementRef } from 'react'
import { IconDots } from '@tabler/icons-react'
import { useToggle } from '@/hooks/use_toggle'
import { EditColumn } from './form/edit_kanban_column'

export function ColumnHeader(props: { columnId: number; columnName: string; countTask: number }) {
  const { columnId, columnName, countTask } = props
  const ref = useRef<ElementRef<'input'>>(null)
  const [enableEditing, onEnableEditing] = useToggle(false)

  return (
    <div className="flex items-center justify-between mb-4 py-4 border-b-2 border-gray-500">
      <div className="flex items-center gap-x-2">
        {enableEditing ? (
          <EditColumn name={columnName} columnId={columnId} onClose={onEnableEditing} />
        ) : (
          <span onClick={onEnableEditing} role="button" className="text-sm font-medium ">
            {columnName}
          </span>
        )}
        {/* <Badge variant="outline">{countTask}</Badge> */}
      </div>
      <IconDots className="size-4 stroke-gray-500" />
    </div>
  )
}
