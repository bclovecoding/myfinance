import DataGrid from './data-grid'

export default function Page() {
  const title = 'Transactions summary'
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
    </div>
  )
}
