import { format } from 'date-fns'
import {
  Tooltip,
  XAxis,
  // ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts'
import CustomTooltip from './custom-tooltip'

import ResponsiveContainer from './responsive-container'

export default function BarVariant({ data }: ChartVariantProps) {
  return (
    <ResponsiveContainer>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, 'MM-dd')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="income" fill="#3d82f6" className="drop-shadow-sm" />
        <Bar dataKey="expenses" fill="#f43f5e" className="drop-shadow-sm" />
      </BarChart>
    </ResponsiveContainer>
  )
}
