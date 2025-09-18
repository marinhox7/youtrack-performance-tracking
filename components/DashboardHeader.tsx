import { RefreshCw } from 'lucide-react'

interface DashboardHeaderProps {
  onRefresh: () => void
  lastUpdated: Date | null
  isLoading: boolean
}

export function DashboardHeader({ onRefresh, lastUpdated, isLoading }: DashboardHeaderProps) {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              YouTrack Performance Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Análise de KPIs e métricas de performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Última atualização: {lastUpdated.toLocaleString('pt-BR')}
              </span>
            )}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}