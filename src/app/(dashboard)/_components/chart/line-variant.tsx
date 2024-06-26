import { format } from 'date-fns'
import {
  Tooltip,
  XAxis,
  // ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts'
import CustomTooltip from './custom-tooltip'
import ResponsiveContainer from './responsive-container'
export default function LineVariant({ data }: ChartVariantProps) {
  return (
    <ResponsiveContainer>
      <LineChart data={data}>
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
        <Line
          dot={false}
          dataKey="income"
          stroke="#3d82f6"
          strokeWidth={2}
          className="drop-shadow-sm"
        />
        <Line
          dot={false}
          dataKey="expenses"
          stroke="#f43f5e"
          strokeWidth={2}
          className="drop-shadow-sm"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
