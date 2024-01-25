import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import Spinner from './spinner'

export const buttonVariants = cva(
  'h-10 px-3 py-1.5 text-sm inline-flex items-center justify-center space-x-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-900 text-primary-foreground hover:bg-zinc-600 transition !font-medium focus-visible:ring-ring',
        destructive: 'bg-red-600 hover:opacity-75 transition text-white focus-visible:ring-red-600',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button: React.FunctionComponent<React.PropsWithChildren<ButtonProps>> = ({
  children,
  disabled,
  loading,
  variant,
  ...props
}) => {
  return (
    <button disabled={loading || disabled} {...props} className={buttonVariants({ variant })}>
      {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export default Button
