import { Metadata } from 'next'
import Header from './header'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="px-3 lg:px-14">{children}</main>
    </>
  )
}
