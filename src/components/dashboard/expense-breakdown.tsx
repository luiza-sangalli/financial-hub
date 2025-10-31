'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ExpenseStats {
  recurringExpenses: number
  oneTimeExpenses: number
  totalExpense: number
}

export function ExpenseBreakdown () {
  const [stats, setStats] = useState<ExpenseStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats')
      const data = await res.json()
      
      if (data.success) {
        setStats({
          recurringExpenses: data.stats.recurringExpenses,
          oneTimeExpenses: data.stats.oneTimeExpenses,
          totalExpense: data.stats.totalExpense
        })
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Despesas</CardTitle>
          <CardDescription>
            Distribuição entre gastos fixos e variáveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            Carregando...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Despesas</CardTitle>
        <CardDescription>
          Distribuição entre gastos fixos e variáveis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Gastos Fixos (Recorrentes) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔄</span>
                <div>
                  <p className="font-semibold">Gastos Fixos</p>
                  <p className="text-xs text-slate-500">Despesas recorrentes mensais</p>
                </div>
              </div>
              <Badge variant="secondary">
                {getPercentage(stats.recurringExpenses, stats.totalExpense)}%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-red-600 mb-2">
              {formatCurrency(stats.recurringExpenses)}
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all"
                style={{
                  width: `${getPercentage(stats.recurringExpenses, stats.totalExpense)}%`
                }}
              />
            </div>
          </div>

          <div className="border-t pt-4" />

          {/* Gastos Variáveis (Pontuais) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-semibold">Gastos Variáveis</p>
                  <p className="text-xs text-slate-500">Despesas pontuais e únicas</p>
                </div>
              </div>
              <Badge variant="secondary">
                {getPercentage(stats.oneTimeExpenses, stats.totalExpense)}%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {formatCurrency(stats.oneTimeExpenses)}
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all"
                style={{
                  width: `${getPercentage(stats.oneTimeExpenses, stats.totalExpense)}%`
                }}
              />
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Total de Despesas</span>
              <span className="text-2xl font-bold text-red-700">
                {formatCurrency(stats.totalExpense)}
              </span>
            </div>
          </div>

          {/* Insight */}
          {stats.totalExpense > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-2">
                <span className="text-xl">💡</span>
                <div className="flex-1">
                  <p className="font-medium text-blue-900 mb-1">Insight</p>
                  <p className="text-sm text-blue-700">
                    {stats.recurringExpenses > stats.oneTimeExpenses
                      ? 'Seus gastos fixos representam a maior parte das despesas. Considere revisar contratos e assinaturas recorrentes.'
                      : 'Seus gastos variáveis são maiores que os fixos. Isso indica boa flexibilidade financeira, mas atenção aos gastos pontuais.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

