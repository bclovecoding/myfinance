import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Category | My Finance',
}

export default function Layout({ children }: React.PropsWithChildren) {
  return <>{children}</>
}
