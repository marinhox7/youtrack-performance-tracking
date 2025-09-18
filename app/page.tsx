'use client'

import { useState, useEffect } from 'react'
import { YouTrackIssue, DashboardKPI, ChartData } from '@/types/youtrack'
import { youTrackAPI } from '@/lib/youtrack-api'
import { KPICalculator } from '@/lib/kpi-calculator'
import { KPICard } from '@/components/KPICard'
import { PieChart } from '@/components/PieChart'
import { LineChart } from '@/components/LineChart'
import { BarChart } from '@/components/BarChart'
import { DashboardHeader } from '@/components/DashboardHeader'

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
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Carregar issues dos últimos 30 dias
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000))

      const issuesData = await youTrackAPI.getIssuesByDateRange(startDate, endDate)
      setIssues(issuesData)

      // Calcular KPIs
      const totalIssues = KPICalculator.calculateTotalIssues(issuesData)
      const resolvedIssues = KPICalculator.calculateResolvedIssues(issuesData)
      const avgResolutionTime = KPICalculator.calculateAverageResolutionTime(issuesData)

      setKpis([totalIssues, resolvedIssues, avgResolutionTime])

      // Calcular dados para gráficos
      const priorityData = KPICalculator.calculateIssuesByPriority(issuesData)
      const projectData = KPICalculator.calculateIssuesByProject(issuesData)
      const stateData = KPICalculator.calculateIssuesByState(issuesData)
      const timelineData = KPICalculator.calculateIssuesCreatedOverTime(issuesData)
      const teamData = KPICalculator.calculateTeamPerformance(issuesData)

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

  useEffect(() => {
    loadData()
  }, [])

  if (error && !lastUpdated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader onRefresh={loadData} lastUpdated={lastUpdated} isLoading={isLoading} />
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
      <DashboardHeader onRefresh={loadData} lastUpdated={lastUpdated} isLoading={isLoading} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <KPICard key={index} kpi={kpi} />
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PieChart data={charts.priorityData} title="Issues por Prioridade" />
          <PieChart data={charts.stateData} title="Issues por Estado" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChart data={charts.projectData} title="Issues por Projeto" />
          <BarChart data={charts.teamData} title="Performance da Equipe" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <LineChart data={charts.timelineData} title="Issues Criadas ao Longo do Tempo" />
        </div>

        {error && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
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
      </main>
    </div>
  )
}