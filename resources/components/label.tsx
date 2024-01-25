import * as React from 'react'

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {}

const Label: React.FunctionComponent<React.PropsWithChildren<LabelProps>> = ({ children }) => {
  return <label className="text-sm font-medium leading-none">{children}</label>
}

export default Label
