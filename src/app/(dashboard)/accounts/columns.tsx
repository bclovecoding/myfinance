'use client'
import { InferResponseType } from 'hono'
import { client } from '@/lib/hono'

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

export type RespType = InferResponseType<typeof client.api.accounts.$get, 200>

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
]
