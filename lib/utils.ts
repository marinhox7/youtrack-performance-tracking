import { YouTrackIssue, SprintValue } from '@/types/youtrack'

/**
 * Extrai informações de Sprint de uma issue do YouTrack
 */
export function extractSprintFromIssue(issue: YouTrackIssue): SprintValue | null {
  if (!issue.customFields || issue.customFields.length === 0) {
    return null
  }

  // Procurar pelo campo Sprints nos customFields
  const sprintField = issue.customFields.find(field => {
    const fieldName = field.name?.toLowerCase()
    const projectFieldName = field.projectCustomField?.field?.name?.toLowerCase()

    return fieldName === 'sprints' ||
           fieldName === 'sprint' ||
           projectFieldName === 'sprints' ||
           projectFieldName === 'sprint'
  })

  if (!sprintField || !sprintField.value) {
    return null
  }

  // Verificar diferentes formatos de valor do campo Sprint
  const sprintValue = sprintField.value

  // Caso 1: Valor é um objeto com propriedade name
  if (typeof sprintValue === 'object' && sprintValue !== null) {
    if ('name' in sprintValue && sprintValue.name) {
      return {
        name: String(sprintValue.name),
        value: String(sprintValue.name)
      }
    }

    // Caso 2: Valor é um array de objetos (múltiplas sprints)
    if (Array.isArray(sprintValue) && sprintValue.length > 0) {
      const firstSprint = sprintValue[0]
      if (typeof firstSprint === 'object' && 'name' in firstSprint) {
        return {
          name: String(firstSprint.name),
          value: String(firstSprint.name)
        }
      }
    }
  }

  // Caso 3: Valor é uma string direta
  if (typeof sprintValue === 'string' && sprintValue.trim()) {
    return {
      name: sprintValue.trim(),
      value: sprintValue.trim()
    }
  }

  return null
}

/**
 * Enriquece uma lista de issues com informações de Sprint extraídas
 */
export function enrichIssuesWithSprint(issues: YouTrackIssue[]): YouTrackIssue[] {
  return issues.map(issue => ({
    ...issue,
    sprint: extractSprintFromIssue(issue)
  }))
}

/**
 * Filtra issues por Sprint específica
 */
export function filterIssuesBySprint(issues: YouTrackIssue[], sprintName: string | null): YouTrackIssue[] {
  if (!sprintName || sprintName === 'all') {
    return issues
  }

  return issues.filter(issue => {
    const issueSprint = issue.sprint || extractSprintFromIssue(issue)
    return issueSprint?.name === sprintName
  })
}

/**
 * Obtém lista única de sprints de uma lista de issues
 */
export function getUniqueSprintsFromIssues(issues: YouTrackIssue[]): SprintValue[] {
  const sprintsSet = new Set<string>()

  issues.forEach(issue => {
    const sprint = issue.sprint || extractSprintFromIssue(issue)
    if (sprint && sprint.name) {
      sprintsSet.add(sprint.name)
    }
  })

  return Array.from(sprintsSet)
    .sort()
    .map(name => ({ name, value: name }))
}

/**
 * Formata data para exibição
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Calcula diferença em dias entre duas datas
 */
export function daysBetween(start: Date, end: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((end.getTime() - start.getTime()) / msPerDay)
}

/**
 * Verifica se uma issue está resolvida baseada no estado
 */
export function isIssueResolved(issue: YouTrackIssue): boolean {
  if (issue.resolved) {
    return true
  }

  const resolvedStates = ['done', 'closed', 'production', 'fixed', 'resolved']
  const stateName = issue.state?.name?.toLowerCase() || ''

  return resolvedStates.some(state => stateName.includes(state))
}

/**
 * Verifica se uma issue está ativa (não resolvida e não no backlog)
 */
export function isIssueActive(issue: YouTrackIssue): boolean {
  if (isIssueResolved(issue)) {
    return false
  }

  const excludedStates = ['moved to next sprint', 'backlog', 'archived', 'cancelled']
  const stateName = issue.state?.name?.toLowerCase() || ''

  return !excludedStates.some(state => stateName.includes(state))
}

/**
 * Obtém cor para exibição baseada na prioridade
 */
export function getPriorityColor(priority?: string): string {
  if (!priority) return 'gray'

  const lowerPriority = priority.toLowerCase()

  if (lowerPriority.includes('critical') || lowerPriority.includes('blocker')) {
    return 'red'
  }
  if (lowerPriority.includes('high')) {
    return 'orange'
  }
  if (lowerPriority.includes('normal') || lowerPriority.includes('medium')) {
    return 'yellow'
  }
  if (lowerPriority.includes('low') || lowerPriority.includes('minor')) {
    return 'green'
  }

  return 'gray'
}

/**
 * Obtém cor para exibição baseada no estado
 */
export function getStateColor(state?: string): string {
  if (!state) return 'gray'

  const lowerState = state.toLowerCase()

  if (isIssueResolved({ state: { name: state } } as YouTrackIssue)) {
    return 'green'
  }
  if (lowerState.includes('progress') || lowerState.includes('development')) {
    return 'blue'
  }
  if (lowerState.includes('review') || lowerState.includes('testing')) {
    return 'purple'
  }
  if (lowerState.includes('blocked') || lowerState.includes('waiting')) {
    return 'red'
  }

  return 'gray'
}