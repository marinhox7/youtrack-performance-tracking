'use client'

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartData } from '@/types/youtrack'

interface BarChartProps {
  data: ChartData[]
  title: string
  dataKey?: string
}

export function BarChart({ data, title, dataKey = 'value' }: BarChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill="#2563eb" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}