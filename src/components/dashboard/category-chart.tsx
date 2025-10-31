'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CategoryStat {
  name: string
  amount: number
  color: string
}

export function CategoryChart () {
  const [categories, setCategories] = useState<CategoryStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/dashboard/stats')
      const data = await res.json()
      
      if (data.success) {
        setCategories(data.categoryStats)
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
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

  const getTotalAmount = () => {
    return categories.reduce((sum, cat) => sum + cat.amount, 0)
  }

  const getPercentage = (amount: number) => {
    const total = getTotalAmount()
    return total > 0 ? (amount / total * 100).toFixed(1) : 0
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoria</CardTitle>
          <CardDescription>
            Distribuição dos seus gastos
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por Categoria</CardTitle>
        <CardDescription>
          Distribuição dos seus gastos (Top 5)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Nenhum dado disponível
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-slate-600">
                    {formatCurrency(category.amount)}
                  </span>
                </div>
                <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full rounded-full transition-all"
                    style={{
                      backgroundColor: category.color,
                      width: `${getPercentage(category.amount)}%`
                    }}
                  />
                </div>
                <div className="text-xs text-slate-500 text-right">
                  {getPercentage(category.amount)}% do total
                </div>
              </div>
            ))}
            
            {categories.length > 0 && (
              <div className="pt-4 border-t mt-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total de Gastos</span>
                  <span className="text-red-600">
                    {formatCurrency(getTotalAmount())}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

