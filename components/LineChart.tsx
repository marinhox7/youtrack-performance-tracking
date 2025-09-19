'use client'

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartData } from '@/types/youtrack'

interface LineChartProps {
  data: ChartData[]
  title?: string
  dataKey?: string
  isLoading?: boolean
}

export function LineChart({ data, title, dataKey = 'value', isLoading }: LineChartProps) {
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-80">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
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
  )
}