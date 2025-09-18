'use client'

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartData } from '@/types/youtrack'

interface LineChartProps {
  data: ChartData[]
  title: string
  dataKey?: string
}

export function LineChart({ data, title, dataKey = 'value' }: LineChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: '#2563eb' }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}