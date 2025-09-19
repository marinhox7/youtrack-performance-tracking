export interface YouTrackIssue {
  id: string
  idReadable: string
  summary: string
  description?: string
  created: number
  updated: number
  resolved?: number
  reporter: YouTrackUser
  assignee?: YouTrackUser
  project: YouTrackProject
  priority?: YouTrackFieldValue
  state?: YouTrackFieldValue
  type?: YouTrackFieldValue
  customFields: YouTrackCustomField[]
}

export interface YouTrackUser {
  id: string
  name: string
  email?: string
  login: string
  fullName?: string
}

export interface YouTrackProject {
  id: string
  name: string
  shortName: string
}

export interface YouTrackFieldValue {
  id: string
  name: string
  localizedName?: string
}

export interface YouTrackCustomField {
  name: string
  value: any
  projectCustomField: {
    field: {
      name: string
      fieldType: string
    }
  }
}

export interface DashboardKPI {
  title: string
  value: number | string
  change?: number
  changeType?: 'increase' | 'decrease'
  format?: 'number' | 'percentage' | 'time'
}

export interface ChartData {
  name: string
  value: number
  [key: string]: any
}

export interface PerformanceMetrics {
  totalIssues: number
  resolvedIssues: number
  activeIssues: number
  completionRate: number
}

export interface IssueWithState {
  id: string
  idReadable: string
  summary: string
  state: {
    name: string
  }
  created: number
  resolved?: number
  project: {
    name: string
    shortName: string
  }
}