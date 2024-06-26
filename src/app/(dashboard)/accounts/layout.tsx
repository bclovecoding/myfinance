import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account | My Finance',
}

export default function Layout({ children }: React.PropsWithChildren) {
  return <>{children}</>
}
