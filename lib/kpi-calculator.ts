import { YouTrackIssue, DashboardKPI, ChartData } from '@/types/youtrack'
import { filterIssuesBySprint, isIssueResolved, isIssueActive } from '@/lib/utils'

export class KPICalculator {
  // Versões com filtro de Sprint
  static calculateTotalIssuesBySprint(issues: YouTrackIssue[], sprintName?: string | null): DashboardKPI {
    const filteredIssues = filterIssuesBySprint(issues, sprintName || null)

    return {
      title: sprintName ? `Total de Issues - ${sprintName}` : 'Total de Issues',
      value: filteredIssues.length,
      format: 'number'
    }
  }

  static calculateResolvedIssuesBySprint(issues: YouTrackIssue[], sprintName?: string | null): DashboardKPI {
    const filteredIssues = filterIssuesBySprint(issues, sprintName || null)
    const resolved = filteredIssues.filter(issue => isIssueResolved(issue)).length
    const total = filteredIssues.length
    const percentage = total > 0 ? (resolved / total) * 100 : 0

    return {
      title: sprintName ? `Issues Resolvidas - ${sprintName}` : 'Issues Resolvidas',
      value: `${resolved} (${percentage.toFixed(1)}%)`,
      format: 'number',
      change: percentage,
      changeType: percentage >= 70 ? 'increase' : 'decrease'
    }
  }

  static calculateActiveIssuesBySprint(issues: YouTrackIssue[], sprintName?: string | null): DashboardKPI {
    const filteredIssues = filterIssuesBySprint(issues, sprintName || null)
    const active = filteredIssues.filter(issue => isIssueActive(issue)).length

    return {
      title: sprintName ? `Issues Ativas - ${sprintName}` : 'Issues Ativas',
      value: active,
      format: 'number'
    }
  }

  // Versões originais mantidas para compatibilidade
  static calculateTotalIssues(issues: YouTrackIssue[]): DashboardKPI {
    return this.calculateTotalIssuesBySprint(issues, null)
  }

  static calculateResolvedIssues(issues: YouTrackIssue[]): DashboardKPI {
    return this.calculateResolvedIssuesBySprint(issues, null)
  }

  static calculateAverageResolutionTime(issues: YouTrackIssue[], sprintName?: string | null): DashboardKPI {
    const filteredIssues = filterIssuesBySprint(issues, sprintName || null)
    const resolvedIssues = filteredIssues.filter(issue => isIssueResolved(issue) && issue.created)

    if (resolvedIssues.length === 0) {
      return {
        title: sprintName ? `Tempo Médio de Resolução - ${sprintName}` : 'Tempo Médio de Resolução',
        value: 'N/A',
        format: 'time'
      }
    }

    const totalTime = resolvedIssues.reduce((sum, issue) => {
      const resolvedTime = issue.resolved || Date.now()
      return sum + (resolvedTime - issue.created)
    }, 0)

    const averageMs = totalTime / resolvedIssues.length
    const averageDays = Math.round(averageMs / (1000 * 60 * 60 * 24))

    return {
      title: sprintName ? `Tempo Médio de Resolução - ${sprintName}` : 'Tempo Médio de Resolução',
      value: `${averageDays} dias`,
      format: 'time'
    }
  }

  static calculateIssuesByPriority(issues: YouTrackIssue[], sprintName?: string | null): ChartData[] {
    const filteredIssues = filterIssuesBySprint(issues, sprintName || null)
    const priorityCount: { [key: string]: number } = {}

    filteredIssues.forEach(issue => {
      const priority = issue.priority?.name || 'Sem Prioridade'
      priorityCount[priority] = (priorityCount[priority] || 0) + 1
    })

    return Object.entries(priorityCount).map(([name, value]) => ({
      name,
      value
    }))
  }

  static calculateIssuesByProject(issues: YouTrackIssue[], sprintName?: string | null): ChartData[] {
    const filteredIssues = filterIssuesBySprint(issues, sprintName || null)
    const projectCount: { [key: string]: number } = {}

    filteredIssues.forEach(issue => {
      const project = issue.project.name
      projectCount[project] = (projectCount[project] || 0) + 1
    })

    return Object.entries(projectCount).map(([name, value]) => ({
      name,
      value
    }))
  }

  static calculateIssuesByState(issues: YouTrackIssue[], sprintName?: string | null): ChartData[] {
    const filteredIssues = filterIssuesBySprint(issues, sprintName || null)
    const stateCount: { [key: string]: number } = {}

    filteredIssues.forEach(issue => {
      const state = issue.state?.name || 'Sem Estado'
      stateCount[state] = (stateCount[state] || 0) + 1
    })

    return Object.entries(stateCount).map(([name, value]) => ({
      name,
      value
    }))
  }

  static calculateIssuesCreatedOverTime(issues: YouTrackIssue[], days: number = 30): ChartData[] {
    const now = new Date()
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))

    const dailyCount: { [key: string]: number } = {}

    // Inicializar todos os dias com 0
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000))
      const dateStr = date.toISOString().split('T')[0]
      dailyCount[dateStr] = 0
    }

    // Contar issues por dia
    issues.forEach(issue => {
      const createdDate = new Date(issue.created)
      if (createdDate >= startDate) {
        const dateStr = createdDate.toISOString().split('T')[0]
        if (dailyCount.hasOwnProperty(dateStr)) {
          dailyCount[dateStr]++
        }
      }
    })

    return Object.entries(dailyCount).map(([date, count]) => ({
      name: new Date(date).toLocaleDateString('pt-BR'),
      value: count,
      date
    }))
  }

  static calculateTeamPerformance(issues: YouTrackIssue[], sprintName?: string | null): ChartData[] {
    const filteredIssues = filterIssuesBySprint(issues, sprintName || null)
    const userStats: { [key: string]: { resolved: number, total: number } } = {}

    filteredIssues.forEach(issue => {
      const assignee = issue.assignee?.fullName || issue.assignee?.name || 'Não Atribuído'

      if (!userStats[assignee]) {
        userStats[assignee] = { resolved: 0, total: 0 }
      }

      userStats[assignee].total++
      if (isIssueResolved(issue)) {
        userStats[assignee].resolved++
      }
    })

    return Object.entries(userStats).map(([name, stats]) => ({
      name,
      value: stats.resolved,
      total: stats.total,
      percentage: stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0
    }))
  }
}