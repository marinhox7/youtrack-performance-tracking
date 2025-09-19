'use client'

import { useState, useEffect } from 'react'
import { SprintValue } from '@/types/youtrack'
import { youTrackAPI } from '@/lib/youtrack-api'

interface SprintFilterProps {
  selectedSprint: string | null
  onSprintChange: (sprint: string | null) => void
  isLoading?: boolean
}

export function SprintFilter({ selectedSprint, onSprintChange, isLoading }: SprintFilterProps) {
  const [availableSprints, setAvailableSprints] = useState<SprintValue[]>([])
  const [isLoadingSprints, setIsLoadingSprints] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSprints()
  }, [])

  const loadSprints = async () => {
    try {
      setIsLoadingSprints(true)
      setError(null)
      const sprints = await youTrackAPI.getAvailableSprints()
      setAvailableSprints(sprints)
    } catch (error) {
      console.error('Erro ao carregar sprints:', error)
      setError('Erro ao carregar sprints')
    } finally {
      setIsLoadingSprints(false)
    }
  }

  const handleRefreshSprints = () => {
    loadSprints()
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label htmlFor="sprint-filter" className="text-sm font-medium text-gray-700">
            🏃‍♂️ Filtrar por Sprint:
          </label>
          <select
            id="sprint-filter"
            value={selectedSprint || 'all'}
            onChange={(e) => onSprintChange(e.target.value === 'all' ? null : e.target.value)}
            disabled={isLoading || isLoadingSprints}
            className="min-w-[200px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="all">🌟 Todas as Sprints</option>
            {availableSprints.map((sprint) => (
              <option key={sprint.value} value={sprint.value}>
                {sprint.name}
              </option>
            ))}
          </select>

          {isLoadingSprints && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-500">Carregando sprints...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-red-600">❌ {error}</span>
              <button
                onClick={handleRefreshSprints}
                className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleRefreshSprints}
          disabled={isLoadingSprints}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          <span>🔄</span>
          <span>Atualizar Sprints</span>
        </button>
      </div>

      {availableSprints.length === 0 && !isLoadingSprints && !error && (
        <div className="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
          ⚠️ Nenhuma sprint encontrada. Verifique se os projetos possuem o campo "Sprints" configurado.
        </div>
      )}

      {selectedSprint && (
        <div className="mt-3 flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            📊 Filtrado por: {selectedSprint}
          </span>
          <button
            onClick={() => onSprintChange(null)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            ✕ Remover filtro
          </button>
        </div>
      )}

      {availableSprints.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {availableSprints.length} sprint{availableSprints.length !== 1 ? 's' : ''} disponível{availableSprints.length !== 1 ? 'is' : ''}
        </div>
      )}
    </div>
  )
}