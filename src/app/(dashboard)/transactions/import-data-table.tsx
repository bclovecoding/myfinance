import { formatDate } from 'date-fns'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const outputDateFormat = 'yyyy-MM-dd'
const options = ['amount', 'date', 'category', 'notes']

type TableHeadSelectProps = {
  columnName: string
  selectedColumns: SelectedColumnsState
  onChange: (column: string, value: string) => void
}

function TableHeadSelect({
  columnName,
  selectedColumns,
  onChange,
}: TableHeadSelectProps) {
  const currentSelection = selectedColumns[columnName]

  return (
    <Select
      value={currentSelection || 'skip'}
      onValueChange={(value) => onChange(columnName, value)}
    >
      <SelectTrigger
        className={cn(
          'border-none outline-none bg-transparent capitalize focus:ring-offset-0 focus:ring-transparent',
          currentSelection && 'text-blue-500'
        )}
      >
        <SelectValue placeholder="Skip" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="skip">Skip</SelectItem>
        {options.map((option, idx) => {
          const disabled =
            Object.values(selectedColumns).includes(option) &&
            selectedColumns[columnName] !== option
          return (
            <SelectItem
              key={idx}
              value={option}
              disabled={disabled}
              className="capitalize"
            >
              {option}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

type Props = {
  importResult: ImportResult
  selectedColumns: SelectedColumnsState
  onTableHeadSelectChange: (columnName: string, value: string) => void
}

export default function ImportDataTable({
  importResult,
  selectedColumns,
  onTableHeadSelectChange,
}: Props) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {importResult.keys.map((title, idx) => (
              <TableHead key={idx}>
                <TableHeadSelect
                  columnName={title}
                  selectedColumns={selectedColumns}
                  onChange={onTableHeadSelectChange}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {importResult.list.map((data, idx) => (
            <TableRow key={`row-${idx}`}>
              {importResult.keys.map((title, idx2) => (
                <TableCell key={`${idx}-${idx2}`}>{data[title]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
