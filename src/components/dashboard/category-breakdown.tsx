'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CategoryData {
  name: string
  amount: number
  color: string
  count: number
}

interface CategoryBreakdownProps {
  title: string
  description: string
  data: CategoryData[]
  type: 'income' | 'expense'
  loading?: boolean
}

export function CategoryBreakdown ({ title, description, data, type, loading }: CategoryBreakdownProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Carregando...</p>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-8">
            Nenhuma categoria encontrada
          </p>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const total = data.reduce((sum, cat) => sum + cat.amount, 0)
  const maxAmount = Math.max(...data.map(cat => cat.amount))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((category) => {
            const percentage = total > 0 ? (category.amount / total) * 100 : 0
            const barWidth = maxAmount > 0 ? (category.amount / maxAmount) * 100 : 0

            return (
              <div key={category.name} className="space-y-2">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {category.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(category.amount)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Total */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700">Total</span>
            <span className={`text-lg font-bold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

