import useError from '@/hooks/use_error'
import clsx from 'clsx'
import * as React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input: React.FunctionComponent<InputProps> = ({ className, id, ...props }) => {
  const error = useError(id)

  return (
    <>
      <input
        className={clsx(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
          error && 'border-red-500/50'
        )}
        id={id}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500" id={`${id}-error`}>
          {error}
        </p>
      )}
    </>
  )
}

export default Input
