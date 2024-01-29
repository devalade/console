import * as React from 'react'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/card'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/menubar'
import { IconPlug, IconTrash } from '@tabler/icons-react'
import DeleteDatabaseDialog from './delete_database_dialog'
import ConnectDatabaseDialog from './connect_database_dialog'
import type { Project } from '@/concerns/projects/types/project'
import type { Database } from '../types/database'

export interface DatabaseCardProps {
  project: Project
  database: Database
}

const DatabaseCard = ({ project, database }: DatabaseCardProps) => {
  const [deleteDatabaseOpen, setDeleteDatabaseOpen] = React.useState(false)
  const [connectDatabaseOpen, setConnectDatabaseOpen] = React.useState(false)

  let iconSrc: string
  switch (database.dbms) {
    case 'postgres':
      iconSrc = '/icons/postgres.svg'
      break
    case 'mysql':
      iconSrc = '/icons/mysql.svg'
      break
    case 'redis':
      iconSrc = '/icons/redis.svg'
      break
  }

  return (
    <div>
      <DeleteDatabaseDialog
        project={project}
        database={database}
        open={deleteDatabaseOpen}
        setOpen={setDeleteDatabaseOpen}
      />
      <ConnectDatabaseDialog
        database={database}
        open={connectDatabaseOpen}
        setOpen={setConnectDatabaseOpen}
      />

      <Card>
        <CardContent>
          <div className="font-semibold flex items-center space-x-2 justify-between">
            <CardTitle className="!text-lg">{database.name}</CardTitle>
            <div className="flex space-x-2">
              <Menubar className="border-0">
                <MenubarMenu>
                  <MenubarTrigger className="cursor-pointer !px-0 !py-0 hover:opacity-50 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                      />
                    </svg>
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem onClick={() => setConnectDatabaseOpen(true)}>
                      <IconPlug className="w-4 h-4 mr-2" />
                      Connect
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem
                      className="w-full text-red-600"
                      onClick={() => setDeleteDatabaseOpen(true)}
                    >
                      <IconTrash className="w-4 h-4 mr-2" />
                      Delete
                    </MenubarItem>{' '}
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>

          <CardDescription>{database.slug}</CardDescription>
          <div className="pt-1 flex justify-between space-x-2">
            <img src={iconSrc} className="w-7 h-7" alt="Database icon" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DatabaseCard
