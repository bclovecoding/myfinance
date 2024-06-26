type NewDataState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

type OpenDataState = {
  id?: string
  isOpen: boolean
  onOpen: (id: string) => void
  onClose: () => void
}

type ChartVariantProps = {
  data: {
    income: number
    expenses: number
    date: string
  }[]
}

type SpendingChartProps = {
  data?: {
    value: number
    name: string
  }[]
}

type ImportResult = {
  sheetName: string
  keys: string[]
  list: any[]
}

interface SelectedColumnsState {
  [key: string]: string | null
}
