import { useClickOutside } from '@/hooks/use_click_outside'
import { useForm } from '@inertiajs/react'
import React, { useRef, type ElementRef, type ChangeEvent, type FormEvent } from 'react'

export function EditColumn(props: { columnId: number; name: string; onClose: () => void }) {
  const { name, onClose } = props
  const ref = useRef<ElementRef<'input'>>(null)

  const { data, setData } = useForm({
    name,
  })

  useClickOutside(ref, (event) => {
    onClose()
  })

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setData('name', e.target.value)
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: add logic to edit the column name
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        ref={ref}
        autoFocus
        onChange={onChange}
        value={data.name}
        className="appearance-none bg-transparent text-sm font-medium border-none p-0 w-fit rounded-full focus:ring-black outline:ring-black"
      />
    </form>
  )
}
