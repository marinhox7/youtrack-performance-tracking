'use client'

import { useState, useEffect } from 'react'
import { YouTrackIssue, DashboardKPI, ChartData, DashboardFilters } from '@/types/youtrack'
import { youTrackAPI } from '@/lib/youtrack-api'
import { KPICalculator } from '@/lib/kpi-calculator'
import { enrichIssuesWithSprint } from '@/lib/utils'
import { SprintFilter } from '@/components/SprintFilter'
import { DashboardHeader } from '@/components/DashboardHeader'
import { KPICard } from '@/components/KPICard'
import { BarChart } from '@/components/BarChart'
import { PieChart } from '@/components/PieChart'
import { LineChart } from '@/components/LineChart'

export default function Dashboard() {
  const [issues, setIssues] = useState<YouTrackIssue[]>([])
  const [kpis, setKpis] = useState<DashboardKPI[]>([])
  const [charts, setCharts] = useState<{
    priorityData: ChartData[]
    projectData: ChartData[]
    stateData: ChartData[]
    timelineData: ChartData[]
    teamData: ChartData[]
  }>({
    priorityData: [],
    projectData: [],
    stateData: [],
    timelineData: [],
    teamData: []
  })
  const [filters, setFilters] = useState<DashboardFilters>({
    selectedSprint: null,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
      end: new Date()
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      let issuesData: YouTrackIssue[]

      if (filters.selectedSprint) {
        // Buscar issues por sprint e período
        issuesData = await youTrackAPI.getIssuesBySprintAndDateRange(
          filters.selectedSprint,
          filters.dateRange.start,
          filters.dateRange.end
        )
      } else {
        // Buscar issues apenas por período
        issuesData = await youTrackAPI.getIssuesByDateRange(
          filters.dateRange.start,
          filters.dateRange.end
        )
      }

      // Enriquecer issues com dados de sprint
      const enrichedIssues = enrichIssuesWithSprint(issuesData)
      setIssues(enrichedIssues)

      // Calcular KPIs com filtro de sprint
      const totalIssues = KPICalculator.calculateTotalIssuesBySprint(enrichedIssues, filters.selectedSprint)
      const resolvedIssues = KPICalculator.calculateResolvedIssuesBySprint(enrichedIssues, filters.selectedSprint)
      const activeIssues = KPICalculator.calculateActiveIssuesBySprint(enrichedIssues, filters.selectedSprint)
      const avgResolutionTime = KPICalculator.calculateAverageResolutionTime(enrichedIssues, filters.selectedSprint)

      setKpis([totalIssues, resolvedIssues, activeIssues, avgResolutionTime])

      // Calcular dados para gráficos com filtro
      const priorityData = KPICalculator.calculateIssuesByPriority(enrichedIssues, filters.selectedSprint)
      const projectData = KPICalculator.calculateIssuesByProject(enrichedIssues, filters.selectedSprint)
      const stateData = KPICalculator.calculateIssuesByState(enrichedIssues, filters.selectedSprint)
      const timelineData = KPICalculator.calculateIssuesCreatedOverTime(enrichedIssues)
      const teamData = KPICalculator.calculateTeamPerformance(enrichedIssues, filters.selectedSprint)

      setCharts({
        priorityData,
        projectData,
        stateData,
        timelineData,
        teamData
      })

      setLastUpdated(new Date())
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados do YouTrack. Verifique as configurações de API.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSprintChange = (sprint: string | null) => {
    setFilters(prev => ({
      ...prev,
      selectedSprint: sprint
    }))
  }

  useEffect(() => {
    loadData()
  }, [filters.selectedSprint]) // Recarregar quando sprint mudar

  useEffect(() => {
    // Carregamento inicial
    loadData()

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadData()
    }, 300000)

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
      <DashboardHeader
        onRefresh={loadData}
        lastUpdated={lastUpdated}
        isLoading={isLoading}
        selectedSprint={filters.selectedSprint}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtro de Sprint */}
        <div className="mb-8">
          <SprintFilter
            selectedSprint={filters.selectedSprint}
            onSprintChange={handleSprintChange}
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

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <KPICard key={index} kpi={kpi} isLoading={isLoading} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Issues por Prioridade */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Issues por Prioridade</h3>
            <PieChart data={charts.priorityData} isLoading={isLoading} />
          </div>

          {/* Issues por Estado */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Issues por Estado</h3>
            <BarChart data={charts.stateData} isLoading={isLoading} />
          </div>

          {/* Issues por Projeto */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Issues por Projeto</h3>
            <BarChart data={charts.projectData} isLoading={isLoading} />
          </div>

          {/* Performance da Equipe */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance da Equipe</h3>
            <BarChart data={charts.teamData} isLoading={isLoading} />
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Issues Criadas ao Longo do Tempo</h3>
          <LineChart data={charts.timelineData} isLoading={isLoading} />
        </div>

        {/* Resumo */}
        {issues.length > 0 && !isLoading && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Resumo {filters.selectedSprint ? `- ${filters.selectedSprint}` : ''}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total de Issues</h3>
                <p className="text-2xl font-bold text-gray-900">{issues.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sprints Únicas</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(issues.filter(i => i.sprint).map(i => i.sprint!.name)).size}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Projetos</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(issues.map(i => i.project.name)).size}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}