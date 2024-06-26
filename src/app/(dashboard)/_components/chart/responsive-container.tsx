import { JSXElementConstructor, ReactElement } from 'react'
import { ResponsiveContainer } from 'recharts'

type Props = {
  children: ReactElement<any, string | JSXElementConstructor<any>>
}

export default function Container({ children }: Props) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      {children}
    </ResponsiveContainer>
  )
}
