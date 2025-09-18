import { DashboardKPI } from '@/types/youtrack'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  kpi: DashboardKPI
}

export function KPICard({ kpi }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {kpi.title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {kpi.value}
          </p>
        </div>
        {kpi.change && (
          <div className={`flex items-center ${
            kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {kpi.changeType === 'increase' ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(kpi.change)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}