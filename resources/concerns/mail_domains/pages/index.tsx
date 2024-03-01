import Button from '@/components/button'
import MailsLayout from '@/concerns/mails/mails_layout'
import { IconCirclePlus, IconDots, IconTrash, IconWorldWww } from '@tabler/icons-react'
import * as React from 'react'
import AddMailDomainDialog from '../concerns/add_mail_domain_dialog'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/table'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown_menu'
import type { MailDomain } from '../types'
import useParams from '@/hooks/use_params'
import { Card, CardContent } from '@/components/card'

interface IndexProps {
  mailDomains: MailDomain[]
}

const Index: React.FunctionComponent<IndexProps> = ({ mailDomains }) => {
  const [loaded, setLoaded] = React.useState(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const params = useParams()
  const columns: ColumnDef<MailDomain>[] = [
    {
      accessorKey: 'domain',
      header: 'Domain',
      cell: ({ row }) => <div>{row.getValue('domain')}</div>,
    },
    {
      accessorKey: 'isVerified',
      header: 'Status',
      cell: ({ row, ...rest }) => (
        <div>
          {row.getValue('isVerified') ? (
            <span className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition rounded-md py-1.5 px-3 bg-emerald-400/10 text-emerald-500 ring-1 ring-inset ring-emerald-400/20">
              Verified
            </span>
          ) : (
            <span className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition rounded-md py-1.5 px-3 bg-red-400/10 text-red-500 ring-1 ring-inset ring-red-400/20">
              Not verified
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger type="button" className="flex items-center space-x-2">
            <IconDots className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <form
              method="post"
              action={`/organizations/${params.organizationSlug}/projects/${params.projectSlug}/mail_domains/${row.original.id}?_method=DELETE`}
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
      ),
    },
  ]
  const table = useReactTable({
    data: mailDomains,
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
  const [showAddDomainDialog, setShowAddDomainDialog] = React.useState(false)

  React.useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) return null

  return (
    <MailsLayout>
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconWorldWww className="w-5 h-5 text-blue-500" />
              <h2 className="font-clash font-semibold text-xl">Domains</h2>
              <Button className="!ml-4" onClick={() => setShowAddDomainDialog(true)} size="sm">
                <IconCirclePlus className="w-4 h-4" />
                <span>Add a new domain</span>
              </Button>
            </div>
          </div>
          <p className="mt-2 text-zinc-800 text-sm">Use your own domains to send your emails.</p>
          <AddMailDomainDialog open={showAddDomainDialog} setOpen={setShowAddDomainDialog} />

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
