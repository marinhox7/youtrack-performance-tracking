'use client'

import { useState, useEffect } from 'react'
import { PerformanceMetrics } from '@/types/youtrack'
import { PerformanceAPI } from '@/lib/performance-api'
import { MetricCard } from '@/components/MetricCard'

export default function Dashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadData = async (forceRefresh: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)

      const performanceMetrics = await PerformanceAPI.getPerformanceMetrics(forceRefresh)
      setMetrics(performanceMetrics)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados do YouTrack. Verifique as configurações de API.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (error && !lastUpdated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro de Configuração
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  <p className="mt-2">
                    Configure as variáveis de ambiente NEXT_PUBLIC_YOUTRACK_URL e NEXT_PUBLIC_YOUTRACK_TOKEN
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">YouTrack Performance Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Acompanhe as métricas de performance do seu projeto
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <p className="text-sm text-gray-500">
                  Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
                </p>
              )}
              <button
                onClick={() => loadData(true)}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Atualizando...
                  </>
                ) : (
                  '🔄 Atualizar'
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total de Issues"
            value={metrics?.totalIssues || 0}
            icon="📊"
            color="blue"
            isLoading={isLoading}
          />
          <MetricCard
            title="Issues Resolvidas"
            value={metrics?.resolvedIssues || 0}
            icon="✅"
            color="green"
            isLoading={isLoading}
          />
          <MetricCard
            title="Issues Ativas"
            value={metrics?.activeIssues || 0}
            icon="🚀"
            color="orange"
            isLoading={isLoading}
          />
          <MetricCard
            title="Taxa de Conclusão"
            value={metrics ? `${metrics.completionRate}%` : '0%'}
            icon="📈"
            color="purple"
            isLoading={isLoading}
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Aviso
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Section */}
        {metrics && !isLoading && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Resumo das Métricas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status das Issues</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Total de Issues:</span>
                    <span className="text-sm font-medium text-gray-900">{metrics.totalIssues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Issues Resolvidas:</span>
                    <span className="text-sm font-medium text-emerald-600">{metrics.resolvedIssues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Issues Ativas:</span>
                    <span className="text-sm font-medium text-amber-600">{metrics.activeIssues}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Performance</h3>
                <div className="mt-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-700">Taxa de Conclusão:</span>
                    <span className="text-sm font-medium text-violet-600">{metrics.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-violet-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(metrics.completionRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}