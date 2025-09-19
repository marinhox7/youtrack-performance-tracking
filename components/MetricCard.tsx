import React from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: string
  color: 'blue' | 'green' | 'orange' | 'purple'
  isLoading?: boolean
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-600',
    border: 'border-blue-200',
    bgLight: 'bg-blue-50'
  },
  green: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    bgLight: 'bg-emerald-50'
  },
  orange: {
    bg: 'bg-amber-500',
    text: 'text-amber-600',
    border: 'border-amber-200',
    bgLight: 'bg-amber-50'
  },
  purple: {
    bg: 'bg-violet-500',
    text: 'text-violet-600',
    border: 'border-violet-200',
    bgLight: 'bg-violet-50'
  }
}

export function MetricCard({ title, value, icon, color, isLoading = false }: MetricCardProps) {
  const colors = colorClasses[color]

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border ${colors.border} p-6 shadow-sm`}>
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${colors.bgLight} rounded-md p-3`}>
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border ${colors.border} p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${colors.bgLight} rounded-md p-3`}>
          <div className={`text-2xl ${colors.text}`}>
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="text-2xl font-bold text-gray-900 mt-1">
              {value}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}