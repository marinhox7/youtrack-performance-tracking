import axios, { AxiosInstance } from 'axios'
import { YouTrackIssue, YouTrackUser, YouTrackProject } from '@/types/youtrack'

export class YouTrackAPI {
  private client: AxiosInstance
  private baseUrl: string
  private token: string

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl
    this.token = token

    this.client = axios.create({
      baseURL: `${baseUrl}/api`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }

  async getIssues(query?: string, limit: number = 100): Promise<YouTrackIssue[]> {
    try {
      const params: any = {
        fields: 'id,idReadable,summary,description,created,updated,resolved,reporter(id,name,login,fullName),assignee(id,name,login,fullName),project(id,name,shortName),priority(id,name),state(id,name),type(id,name),customFields(name,value,projectCustomField(field(name,fieldType)))',
        $top: limit
      }

      if (query) {
        params.query = query
      }

      const response = await this.client.get('/issues', { params })
      return response.data
    } catch (error) {
      console.error('Erro ao buscar issues:', error)
      throw error
    }
  }

  async getProjects(): Promise<YouTrackProject[]> {
    try {
      const response = await this.client.get('/admin/projects', {
        params: {
          fields: 'id,name,shortName'
        }
      })
      return response.data
    } catch (error) {
      console.error('Erro ao buscar projetos:', error)
      throw error
    }
  }

  async getUsers(): Promise<YouTrackUser[]> {
    try {
      const response = await this.client.get('/users', {
        params: {
          fields: 'id,name,login,fullName,email'
        }
      })
      return response.data
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      throw error
    }
  }

  async getIssuesByProject(projectId: string): Promise<YouTrackIssue[]> {
    return this.getIssues(`project: ${projectId}`)
  }

  async getIssuesByUser(userId: string): Promise<YouTrackIssue[]> {
    return this.getIssues(`assignee: ${userId}`)
  }

  async getIssuesByDateRange(startDate: Date, endDate: Date): Promise<YouTrackIssue[]> {
    const start = Math.floor(startDate.getTime())
    const end = Math.floor(endDate.getTime())
    return this.getIssues(`created: ${start} .. ${end}`)
  }

  async getResolvedIssuesByDateRange(startDate: Date, endDate: Date): Promise<YouTrackIssue[]> {
    const start = Math.floor(startDate.getTime())
    const end = Math.floor(endDate.getTime())
    return this.getIssues(`resolved: ${start} .. ${end}`)
  }
}

export const youTrackAPI = new YouTrackAPI(
  process.env.NEXT_PUBLIC_YOUTRACK_URL || '',
  process.env.NEXT_PUBLIC_YOUTRACK_TOKEN || ''
)