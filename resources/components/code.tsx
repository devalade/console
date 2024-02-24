import { cn } from '@/lib/utils'
import * as React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs'

interface CodeProps {
  runtimes: string[]
  codeString: string
  selectedRuntime: string
  setSelectedRuntime: (runtime: string) => void
  className?: string
}

const Code: React.FunctionComponent<CodeProps> = ({
  runtimes,
  codeString,
  selectedRuntime,
  setSelectedRuntime,
  className,
}) => {
  return (
    <div className={cn('max-w-full overflow-x-auto shadow-sm', className)}>
      <div className="bg-accent px-4 py-2 pb-0 flex space-x-4 rounded-md rounded-b-none">
        {runtimes.map((runtime) => (
          <button
            key={runtime}
            className={cn(
              'text-zinc-900 text-sm hover:text-zinc-700 pb-2 border-b border-b-transparent',
              runtime === selectedRuntime && 'border-b border-zinc-900 font-medium'
            )}
            onClick={() => setSelectedRuntime(runtime)}
          >
            {runtime}
          </button>
        ))}
      </div>

      <SyntaxHighlighter
        customStyle={{
          background: 'white',
          fontSize: '0.75rem',
          borderWidth: '2px',
          borderTop: '0',
          borderColor: 'hsl(var(--accent))',
          padding: '0.5rem 1rem',
          maxHeight: '300px',
        }}
        language={selectedRuntime.toLowerCase()}
        style={github}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  )
}

export default Code
