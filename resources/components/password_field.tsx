import * as React from 'react'
import Label from './label'
import Input from './input'

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  divClassName?: string
  label: string
}

const PasswordField: React.FunctionComponent<PasswordFieldProps> = ({
  divClassName,
  label,
  ...props
}) => {
  return (
    <div className={divClassName}>
      <Label>{label}</Label>
      <Input type="password" placeholder="••••••••••••" {...props} />
    </div>
  )
}

export default PasswordField
