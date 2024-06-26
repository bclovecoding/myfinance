import { type ClassValue, clsx } from 'clsx'
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000)
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000
}

export function formatCurrency(value: number) {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

export function calculatePercentageChange(cur: number, pre: number) {
  if (pre === 0) return pre == cur ? 0 : 100

  return Math.floor(((Math.abs(cur) - Math.abs(pre)) / Math.abs(pre)) * 100)
}

export function fillMissingDays(
  activeDays: {
    date: Date
    income: number
    expenses: number
  }[],
  startDate: Date,
  endDate: Date
) {
  if (activeDays.length === 0) {
    return []
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const allTransDays = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day))
    if (found) {
      return found
    }
    return {
      date: day,
      income: 0,
      expenses: 0,
    }
  })

  return allTransDays
}

type Period = {
  from: string | Date | undefined
  to: string | Date | undefined
}

export function formatPeriod(period?: Period) {
  const defaultTo = new Date()
  const defaultFrom = subDays(defaultTo, 30)
  if (!period?.from) {
    return `${format(defaultFrom, 'MM-dd')} - ${format(defaultTo, 'MM-dd')}`
  }

  if (period.to)
    return `${format(period.from, 'MM-dd')} - ${format(period.to, 'MM-dd')}`

  return format(period.from, 'MM-dd')
}

export function formatPercentage(
  value: number,
  options: {
    addPrefix?: boolean
  } = {
    addPrefix: false,
  }
) {
  const result = new Intl.NumberFormat('en-us', {
    style: 'percent',
  }).format(value / 100)

  if (options.addPrefix && value > 0) {
    return '+' + result
  }
  return result
}
