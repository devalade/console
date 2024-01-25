import * as React from 'react'

interface LogoProps {
  variant: 'light' | 'dark'
}

const Logo: React.FunctionComponent<LogoProps> = ({ variant = 'light' }: LogoProps) => {
  if (variant === 'dark') {
    return (
      <svg
        className="mr-2 h-8 w-8"
        viewBox="0 0 190 202"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M95 13L165.668 68.2L178.138 157L95 190.6L11.8616 157L24.3323 68.2L95 13Z"
          stroke="black"
          strokeWidth="20"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 190 202"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2 h-8 w-8"
    >
      <path
        d="M95 13L165.668 68.2L178.138 157L95 190.6L11.8616 157L24.3323 68.2L95 13Z"
        stroke="white"
        strokeWidth="20"
      />
    </svg>
  )
}

export default Logo
