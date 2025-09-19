import { YouTrackIssue, PerformanceMetrics } from '@/types/youtrack'
import { youTrackAPI } from './youtrack-api'

export class PerformanceAPI {
  private static cache: {
    data: PerformanceMetrics | null
    timestamp: number
  } = {
    data: null,
    timestamp: 0
  }

  private static readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  static async fetchAllIssues(): Promise<YouTrackIssue[]> {
    try {
      // Fetch all issues without date restriction for a complete view
      const issues = await youTrackAPI.getIssues('', 1000) // Increased limit for more comprehensive data
      return issues
    } catch (error) {
      console.error('Erro ao buscar issues:', error)
      throw new Error('Falha ao conectar com a API do YouTrack')
    }
  }

  static calculateMetrics(issues: YouTrackIssue[]): PerformanceMetrics {
    // Define resolved states (case insensitive)
    const resolvedStates = ['done', 'closed', 'production']

    // Define excluded states (case insensitive)
    const excludedStates = ['moved to next sprint', 'backlog']

    // Filter issues excluding backlog and moved to next sprint for total count
    const filteredIssues = issues.filter(issue => {
      const stateName = issue.state?.name?.toLowerCase() || ''
      return !excludedStates.some(state => stateName.includes(state.toLowerCase()))
    })

    // Count resolved issues
    const resolvedIssues = filteredIssues.filter(issue => {
      const stateName = issue.state?.name?.toLowerCase() || ''
      return resolvedStates.some(state => stateName.includes(state.toLowerCase()))
    }).length

    // Total issues (excluding backlog and moved to next sprint)
    const totalIssues = filteredIssues.length

    // Active issues = Total - Resolved
    const activeIssues = totalIssues - resolvedIssues

    // Completion rate = (Resolved / Total) * 100
    const completionRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0

    return {
      totalIssues,
      resolvedIssues,
      activeIssues,
      completionRate: Math.round(completionRate * 10) / 10 // Round to 1 decimal place
    }
  }

  static async getPerformanceMetrics(forceRefresh: boolean = false): Promise<PerformanceMetrics> {
    const now = Date.now()

    // Check if we have cached data that's still valid
    if (!forceRefresh && this.cache.data && (now - this.cache.timestamp) < this.CACHE_DURATION) {
      return this.cache.data
    }

    try {
      const issues = await this.fetchAllIssues()
      const metrics = this.calculateMetrics(issues)

      // Update cache
      this.cache = {
        data: metrics,
        timestamp: now
      }

      return metrics
    } catch (error) {
      // If we have cached data, return it even if it's expired
      if (this.cache.data) {
        console.warn('Using cached data due to API error:', error)
        return this.cache.data
      }
      throw error
    }
  }

  static clearCache(): void {
    this.cache = {
      data: null,
      timestamp: 0
    }
  }
}