'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface FilterValues {
  startDate: string
  endDate: string
  type: 'all' | 'INCOME' | 'EXPENSE'
  period: 'all' | 'month' | 'quarter' | 'year' | 'custom'
}

interface TransactionFiltersProps {
  onFilterChange: (filters: FilterValues) => void
}

export function TransactionFilters ({ onFilterChange }: TransactionFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    startDate: '',
    endDate: '',
    type: 'all',
    period: 'month'
  })

  // Definir período padrão (mês atual)
  useEffect(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const newFilters = {
      ...filters,
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0]
    }

    setFilters(newFilters)
    onFilterChange(newFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePeriodChange = (period: FilterValues['period']) => {
    const now = new Date()
    let startDate = ''
    let endDate = now.toISOString().split('T')[0]

    switch (period) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        break
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3)
        startDate = new Date(now.getFullYear(), quarter * 3, 1).toISOString().split('T')[0]
        endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0).toISOString().split('T')[0]
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
        endDate = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]
        break
      case 'all':
        startDate = ''
        endDate = ''
        break
      case 'custom':
        // Manter datas atuais para o usuário customizar
        return
    }

    const newFilters = { ...filters, period, startDate, endDate }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFilters = { ...filters, [field]: value, period: 'custom' as const }
    setFilters(newFilters)
  }

  const handleTypeChange = (type: FilterValues['type']) => {
    const newFilters = { ...filters, type }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const applyCustomDates = () => {
    onFilterChange(filters)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Período pré-definido */}
        <div className="space-y-2">
          <Label>Período</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={filters.period === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePeriodChange('month')}
            >
              Este Mês
            </Button>
            <Button
              variant={filters.period === 'quarter' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePeriodChange('quarter')}
            >
              Trimestre
            </Button>
            <Button
              variant={filters.period === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePeriodChange('year')}
            >
              Este Ano
            </Button>
            <Button
              variant={filters.period === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePeriodChange('all')}
            >
              Tudo
            </Button>
          </div>
        </div>

        {/* Datas customizadas */}
        <div className="space-y-2">
          <Label>Período Customizado</Label>
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Label htmlFor="startDate" className="text-xs text-slate-500">De</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="endDate" className="text-xs text-slate-500">Até</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
          {filters.period === 'custom' && (
            <Button
              size="sm"
              onClick={applyCustomDates}
              className="w-full"
            >
              Aplicar Datas
            </Button>
          )}
        </div>

        {/* Tipo */}
        <div className="space-y-2">
          <Label>Tipo de Transação</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={filters.type === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeChange('all')}
            >
              Todas
            </Button>
            <Button
              variant={filters.type === 'INCOME' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeChange('INCOME')}
              className={filters.type === 'INCOME' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Entradas
            </Button>
            <Button
              variant={filters.type === 'EXPENSE' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeChange('EXPENSE')}
              className={filters.type === 'EXPENSE' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Saídas
            </Button>
          </div>
        </div>

        {/* Info do período selecionado */}
        {(filters.startDate || filters.endDate) && (
          <div className="text-xs text-slate-500 pt-2 border-t">
            <p>
              Período: {filters.startDate ? new Date(filters.startDate + 'T00:00:00').toLocaleDateString('pt-BR') : 'início'} até{' '}
              {filters.endDate ? new Date(filters.endDate + 'T00:00:00').toLocaleDateString('pt-BR') : 'hoje'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

