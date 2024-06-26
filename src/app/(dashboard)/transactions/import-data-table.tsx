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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const outputDateFormat = 'yyyy-MM-dd'
const options = ['amount', 'date', 'category', 'notes']

type TableHeadSelectProps = {
  columnName: string
  columnIndex: number
  selectedColumns: SelectedColumnsState
  onChange: (columnIndex: number, value: string | null) => void
}

function TableHeadSelect({
  columnIndex,
  columnName,
  selectedColumns,
  onChange,
}: TableHeadSelectProps) {
  const currentSelection = selectedColumns[`column_${columnIndex}`]

  return (
    <Select
      value={currentSelection || ''}
      onValueChange={(value) => onChange(columnIndex, value)}
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
            selectedColumns[`column_${columnIndex}`] !== option
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
  onTableHeadSelectChange: (columnIndex: number, value: string | null) => void
}

export default function ImportDataTable({
  importResult,
  selectedColumns,
  onTableHeadSelectChange,
}: Props) {
  const excelDateToJSDate = (date: number) => {
    return new Date(Math.round((date - 25569) * 864e5))
  }
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableCaption>Sheet {importResult.sheetName} Content</TableCaption>
        <TableHeader>
          <TableRow>
            {importResult.keys.map((title, idx) => (
              <TableHead key={idx}>
                <TableHeadSelect
                  columnName={title}
                  columnIndex={idx}
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
