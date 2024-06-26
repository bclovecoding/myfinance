import { Legend, RadialBar, RadialBarChart, Tooltip } from 'recharts'

import { formatCurrency } from '@/lib/utils'

import ResponsiveContainer from './responsive-container'
import CategoryTooltip from './category-tooltip'

import { COLORS } from './constant'

export default function RadialVariant({ data }: SpendingChartProps) {
  return (
    <ResponsiveContainer>
      <RadialBarChart
        cx="50%"
        cy="30%"
        barSize={10}
        outerRadius="90%"
        innerRadius="40%"
        data={data?.map((item, idx) => ({
          ...item,
          fill: COLORS[idx % COLORS.length],
        }))}
      >
        <RadialBar
          label={{
            position: 'insideStart',
            fill: '#fff',
            fontSize: '12px',
          }}
          background
          dataKey="value"
        />
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
                        {formatCurrency(entry.payload.value)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )
          }}
        />
        <Tooltip content={<CategoryTooltip />} />
      </RadialBarChart>
    </ResponsiveContainer>
  )
}
