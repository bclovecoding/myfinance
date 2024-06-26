import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Transactions | My Finance',
}

export default function Layout({ children }: React.PropsWithChildren) {
  return <>{children}</>
}
