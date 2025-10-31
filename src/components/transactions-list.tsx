'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { RecurrenceToggle } from '@/components/recurrence-toggle'

interface Transaction {
  id: string
  amount: number
  description: string
  type: 'INCOME' | 'EXPENSE'
  date: string
  isRecurring?: boolean
  category: {
    id: string
    name: string
    color: string
  } | null
  fileName?: string
  createdAt: string
}

interface TransactionsListProps {
  fileId?: string
  refreshTrigger?: number
  limit?: number
}

export function TransactionsList ({ fileId, refreshTrigger, limit = 50 }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    fetchTransactions()
  }, [refreshTrigger, fileId, offset])

  const fetchTransactions = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset)
      })

      if (fileId) {
        params.append('fileId', fileId)
      }

      const res = await fetch(`/api/transactions?${params}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao carregar transações')
      }

      setTransactions(data.transactions)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (loading && transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações Importadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Carregando...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações Importadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Importadas</CardTitle>
        <CardDescription>
          {pagination && `${pagination.total} transações encontradas`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">
            Nenhuma transação importada ainda
          </p>
        ) : (
          <>
            <div className="space-y-2">
              {transactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {transaction.isRecurring && (
                          <span className="text-sm" title="Transação recorrente">🔄</span>
                        )}
                        <h4 className="font-medium text-sm">{transaction.description}</h4>
                        {transaction.category && (
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: transaction.category.color,
                              color: transaction.category.color
                            }}
                          >
                            {transaction.category.name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{formatDate(transaction.date)}</span>
                        {transaction.fileName && (
                          <>
                            <span>•</span>
                            <span>{transaction.fileName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div>
                        <div
                          className={`font-semibold ${
                            transaction.type === 'INCOME'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'INCOME' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </div>
                        <Badge
                          variant={transaction.type === 'INCOME' ? 'default' : 'secondary'}
                          className="text-xs mt-1"
                        >
                          {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
                        </Badge>
                      </div>
                      <RecurrenceToggle
                        transactionId={transaction.id}
                        isRecurring={transaction.isRecurring || false}
                        onUpdate={fetchTransactions}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination && pagination.hasMore && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setOffset(prev => prev + limit)}
                  disabled={loading}
                >
                  Carregar mais
                </Button>
              </div>
            )}

            {pagination && offset > 0 && (
              <div className="mt-2 flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() => setOffset(prev => Math.max(0, prev - limit))}
                  disabled={loading}
                  size="sm"
                >
                  Voltar
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

