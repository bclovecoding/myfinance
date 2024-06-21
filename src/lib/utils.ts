import { type ClassValue, clsx } from 'clsx'
import { eachDayOfInterval, isSameDay } from 'date-fns'
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

  return Math.floor(((cur - pre) / pre) * 100)
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
