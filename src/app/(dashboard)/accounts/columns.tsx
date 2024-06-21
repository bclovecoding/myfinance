'use client'
import { InferResponseType } from 'hono'
import { client } from '@/lib/hono'

import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Edit,
  Trash,
} from 'lucide-react'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import useConfirm from '@/hook/use-confirm'

import { OneData } from '@/features/accounts/constant'
import { useOpenData, useDeleteData } from '@/features/accounts/use-hooks'

const Actions = ({ id }: { id: string }) => {
  const [ConfirmDlg, confirm] = useConfirm(
    'Confirm',
    `Are you sure to delete this ${OneData}?`
  )
  const { onOpen } = useOpenData()
  const delMutaion = useDeleteData(id)
  const handleDelete = async () => {
    const isOk = await confirm()
    if (isOk) {
      delMutaion.mutate()
    }
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              onOpen(id)
            }}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDlg />
    </>
  )
}

export type RespType = InferResponseType<
  typeof client.api.accounts.$get,
  200
>['data'][0]

export const columns: ColumnDef<RespType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const sortStatus = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(sortStatus === 'asc')}
        >
          Name
          {sortStatus === 'asc' && <ArrowDown className="size-4 ml-2" />}
          {sortStatus === 'desc' && <ArrowUp className="size-4 ml-2" />}
          {!sortStatus && <ArrowUpDown className="size-4 ml-2" />}
        </Button>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
]
