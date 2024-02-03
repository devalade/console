import React, { useState, useEffect } from 'react'
import Label from './label'
import Input from './input'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import generateRandomPassword from '@/lib/generate_random_password'

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  divClassName?: string
  label: string
  autogenerate?: boolean
}

const PasswordField: React.FunctionComponent<PasswordFieldProps> = ({
  divClassName,
  label,
  autogenerate = false,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (autogenerate) {
      const generatedPassword = generateRandomPassword()
      onChange({ target: { value: generatedPassword } } as React.ChangeEvent<HTMLInputElement>)
    }
  }, [])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={divClassName}>
      <Label>{label}</Label>
      <div style={{ position: 'relative' }}>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          onChange={onChange}
          {...props}
        />
        {props.value && (
          <button
            onClick={togglePasswordVisibility}
            type="button"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  )
}

export default PasswordField
