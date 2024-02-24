import * as React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/dialog'
import { type Runtime, formatTemplate } from '../connect_to_database'
import Input from '@/components/input'
import Label from '@/components/label'
import CopyToClipboard from '@/components/copy_to_clipboard'
import type { Database } from '../types/database'
import Code from '@/components/code'

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
  const runtimes: Runtime[] = ['JavaScript', 'PHP', 'Python', 'Java']
  const [selectedRuntime, setSelectedRuntime] = React.useState<string>(runtimes[0])
  const codeString = formatTemplate({
    databaseUri: database.uri,
    runtime: selectedRuntime as Runtime,
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

        <Code
          className="px-6"
          runtimes={runtimes}
          codeString={codeString}
          selectedRuntime={selectedRuntime}
          setSelectedRuntime={setSelectedRuntime}
        />
      </DialogContent>
    </Dialog>
  )
}
