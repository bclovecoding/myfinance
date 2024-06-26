import {
  Cell,
  Legend,
  Pie,
  PieChart,
  // ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { formatPercentage } from '@/lib/utils'

import ResponsiveContainer from './responsive-container'
import CategoryTooltip from './category-tooltip'

import { COLORS } from './constant'

export default function PieVariant({ data }: SpendingChartProps) {
  return (
    <ResponsiveContainer>
      <PieChart>
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="right"
          iconType="circle"
          content={({ payload }: any) => {
            return (
              <ul className="flex flex-col space-y-2">
                {payload.map((entry: any, idx: number) => (
                  <li
                    key={`item-${idx}`}
                    className="flex items-center space-x-2"
                  >
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></span>
                    <div className="space-x-1">
                      <span className="text-sm text-muted-foreground">
                        {entry.value}
                      </span>
                      <span className="text-sm">
                        {formatPercentage(entry.payload.percent * 100)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )
          }}
        />
        <Tooltip content={<CategoryTooltip />} />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={60}
          paddingAngle={2}
          fill="#8884d8"
          dataKey="value"
          labelLine={false}
        >
          {data?.map((_entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
