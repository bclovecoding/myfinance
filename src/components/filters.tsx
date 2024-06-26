import AccountsFilter from '@/components/accounts-filter'
import DateFilter from '@/components/date-filter'
export default function Filters() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-y-2 lg:gap-y-0 lg:gap-x-2">
      <AccountsFilter />
      <DateFilter />
    </div>
  )
}
