import * as React from 'react'
import MailsLayout from '../../mails/mails_layout'
import { Card, CardContent } from '@/components/card'
import { IconCirclePlus, IconDots, IconKey, IconPencil, IconTrash } from '@tabler/icons-react'
import Button from '@/components/button'
import AddApiKeyDialog from '../concerns/add_api_key_dialog'
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown_menu'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/table'
import useParams from '@/hooks/use_params'
import {
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table'
import type { MailApiKey } from '../types'
import CopyToClipboard from '@/components/copy_to_clipboard'
import Input from '@/components/input'
import EditApiKeyDialog from '../concerns/edit_api_key_dialog'

interface IndexProps {
  mailApiKeys: MailApiKey[]
}

const Index: React.FunctionComponent<IndexProps> = ({ mailApiKeys }) => {
  const [showAddApiKeyDialog, setShowAddApiKeyDialog] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const params = useParams()
  const columns: ColumnDef<MailApiKey>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'domain',
      header: 'Domain Access',
      cell: ({ row }) => (
        <div>{row.original.mailDomain ? row.original.mailDomain.domain : 'All domains'}</div>
      ),
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => (
        <div className="flex !w-auto">
          <Input
            className="!rounded-r-none !w-auto !text-zinc-700"
            value={(row.getValue('value') as string).substring(0, 10) + '...'}
            readOnly
          />
          <CopyToClipboard value={row.getValue('value')} />
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created at',
      cell: ({ row }) => <div>{row.getValue('createdAt')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const [showEditApiKeyDialog, setShowEditApiKeyDialog] = React.useState(false)
        return (
          <>
            <EditApiKeyDialog
              open={showEditApiKeyDialog}
              setOpen={setShowEditApiKeyDialog}
              apiKey={row.original}
            />
            <DropdownMenu>
              <DropdownMenuTrigger type="button" className="flex items-center space-x-2">
                <IconDots className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <button
                    type="button"
                    className="w-full cursor-pointer"
                    onClick={() => setShowEditApiKeyDialog(true)}
                  >
                    <IconPencil className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                </DropdownMenuItem>
                <form
                  method="post"
                  action={`/organizations/${params.organizationSlug}/projects/${params.projectSlug}/mail_api_keys/${row.original.id}?_method=DELETE`}
                >
                  <DropdownMenuItem asChild>
                    <button type="submit" className="w-full cursor-pointer">
                      <IconTrash className="w-4 h-4 mr-2 text-red-500" />
                      Delete
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
    },
  ]

  const table = useReactTable({
    data: mailApiKeys,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  React.useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) return null

  return (
    <MailsLayout>
      <AddApiKeyDialog open={showAddApiKeyDialog} setOpen={setShowAddApiKeyDialog} />
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconKey className="w-5 h-5 text-blue-500" />
              <h2 className="font-clash font-semibold text-xl">API keys</h2>
              <Button className="!ml-4" onClick={() => setShowAddApiKeyDialog(true)} size="sm">
                <IconCirclePlus className="w-4 h-4" />
                <span>Add a new API key</span>
              </Button>
            </div>
          </div>
          <p className="mt-2 text-zinc-800 text-sm">
            API keys are used to access the mails API. You can create or revoke them at any time.
          </p>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MailsLayout>
  )
}

export default Index
