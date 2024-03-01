import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import Spinner from './spinner'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'h-10 px-3 py-1.5 inline-flex items-center justify-center space-x-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-900 text-primary-foreground hover:bg-zinc-600 transition !font-medium focus-visible:ring-ring',
        destructive: 'bg-red-600 hover:opacity-75 transition text-white focus-visible:ring-red-600',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: '',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  className?: string
}

const Button: React.FunctionComponent<React.PropsWithChildren<ButtonProps>> = ({
  children,
  disabled,
  loading,
  variant,
  className,
  size,
  ...props
}) => {
  return (
    <button
      disabled={loading || disabled}
      {...props}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export default Button
