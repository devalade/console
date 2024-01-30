import clsx from 'clsx'
import * as React from 'react'

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  className?: string
}

const Label: React.FunctionComponent<React.PropsWithChildren<LabelProps>> = ({
  children,
  className,
}) => {
  return <label className={clsx('text-sm font-medium leading-none', className)}>{children}</label>
}

export default Label
