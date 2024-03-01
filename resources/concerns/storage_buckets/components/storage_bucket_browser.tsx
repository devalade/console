import * as React from 'react'
import type { Project } from '@/concerns/projects/types/project'
import type { StorageBucket } from '../types/storage_bucket'
import type { StorageBucketFile } from '#types/storage'
import { formatFileSize } from '../lib/file_size'
import getInitiatedXAgo from '@/lib/get_initiated_x_ago'
import Button from '@/components/button'
import { Card, CardContent } from '@/components/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/table'
import {
  IconFile,
  IconDownload,
  IconCloud,
  IconDots,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react'
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
import useParams from '@/hooks/use_params'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown_menu'

export type StorageBucketBrowserProps = {
  project: Project
  storageBucket: StorageBucket
  files: StorageBucketFile[]
}

export default function StorageBucketBrowser({
  project,
  storageBucket,
  files,
}: StorageBucketBrowserProps) {
  const [loaded, setLoaded] = React.useState(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const columns: ColumnDef<StorageBucketFile>[] = [
    {
      accessorKey: 'filename',
      header: 'Filename',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IconFile className="w-4 h-4 text-blue-500" />
          <span>{row.getValue('filename')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Content type',
      cell: ({ row }) => <div>{row.getValue('type')}</div>,
    },
    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ row }) => <div>{formatFileSize(row.getValue('size'))}</div>,
    },
    {
      accessorKey: 'updatedAt',
      header: () => <div className="text-right">Updated at</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {getInitiatedXAgo(new Date(row.getValue('updatedAt') as string))}
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
            <DropdownMenuItem asChild className="w-full cursor-pointer">
              <a
                href={`/organizations/${project.organization.slug}/projects/${project.slug}/storage_buckets/${storageBucket.slug}/files/${row.getValue('filename')}`}
              >
                <IconDownload className="w-4 h-4 mr-2" />
                Download
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <form
              method="post"
              action={`/organizations/${project.organization.slug}/projects/${project.slug}/storage_buckets/${storageBucket.slug}/files/${row.getValue('filename')}?_method=DELETE`}
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
        // <div>
        //   <a
        //     href={`/organizations/${project.organization.slug}/projects/${project.slug}/storage_buckets/${storageBucket.slug}/files/${row.getValue('filename')}`}
        //   >
        //       <IconDownload className="w-4 h-4 mr-2" />
        //       Download
        //   </a>

        //   <DropdownMenuSeparator />

        //   <form
        //     method="post"
        //     action={`/organizations/${project.organization.slug}/projects/${project.slug}/storage_buckets/${storageBucket.slug}/files/${row.getValue('filename')}?_method=DELETE`}
        //   >
        //     <button className="w-full" type="submit">
        //       <IconTrash className="w-4 h-4 mr-2 text-red-500" />
        //       Delete
        //     </button>
        //   </form>
        // </div>
      ),
    },
  ]
  const table = useReactTable({
    data: files.map((file) => ({ ...file, id: window.crypto.randomUUID() })),
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
  const uploadFormRef = React.useRef<HTMLFormElement>(null)
  const params = useParams()

  React.useEffect(() => setLoaded(true), [])

  if (!loaded) return null

  return (
    <div className="w-full px-12 py-6">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconCloud className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold">{storageBucket.name}</h2>
            </div>
            <form
              id="upload-form"
              encType="multipart/form-data"
              action={`/organizations/${params.organizationSlug}/projects/${project.slug}/storage_buckets/${storageBucket.slug}/upload`}
              method="post"
              ref={uploadFormRef}
            >
              <input
                type="file"
                name="file"
                id="file"
                onChange={(event) => {
                  if (event.target.files?.length > 0) {
                    uploadFormRef?.current.submit()
                  }
                }}
                hidden
              />
              <Button
                className="ml-4"
                onClick={() => document.getElementById('file')?.click()}
                type="button"
              >
                <IconUpload className="h-4 w-4" />
                <span className="ml-2">Upload file</span>
              </Button>
            </form>
          </div>
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
    </div>
  )
}
