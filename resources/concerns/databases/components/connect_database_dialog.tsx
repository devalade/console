import * as React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/dialog'
import { type Runtime, formatTemplate } from '../connect_to_database'
import Input from '@/components/input'
import Label from '@/components/label'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import CopyToClipboard from '@/components/copy_to_clipboard'
import type { Database } from '../types/database'
import clsx from 'clsx'

export type ConnectDatabaseDialogProps = {
  database: Database

  open: boolean
  setOpen: (open: boolean) => void
}

export default function ConnectDatabaseDialog({
  database,
  open,
  setOpen,
}: ConnectDatabaseDialogProps) {
  const runtimes: Runtime[] = ['Node.js', 'PHP', 'Python', 'Java']
  const [selectedRuntime, setSelectedRuntime] = React.useState(runtimes[0])
  const codeString = formatTemplate({
    databaseUri: database.uri,
    runtime: selectedRuntime,
    database: database.dbms,
    host: database.host,
    name: database.name,
    username: database.username,
    password: database.password,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to my database</DialogTitle>
        </DialogHeader>

        <div className="flex items-end pb-4 px-6">
          <div className="grid gap-1 w-full">
            <Label>URI</Label>
            <div className="flex !w-full">
              <Input
                className="!rounded-r-none !text-zinc-700"
                defaultValue={database.uri}
                readOnly
              />
              <CopyToClipboard value={database.uri} />
            </div>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto px-6">
          <div className="bg-accent px-4 py-2 pb-0 flex space-x-4 rounded-md rounded-b-none">
            {runtimes.map((runtime) => (
              <button
                key={runtime}
                className={clsx(
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
            language={
              selectedRuntime.toLowerCase() === 'node.js'
                ? 'javascript'
                : selectedRuntime.toLowerCase()
            }
            style={github}
          >
            {codeString}
            {formatTemplate({
              databaseUri: database.uri,
              runtime: selectedRuntime,
              database: database.dbms,
              host: database.host,
              name: database.name,
              username: database.username,
              password: database.password,
            })}
          </SyntaxHighlighter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
