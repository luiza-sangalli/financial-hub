'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Pattern {
  description: string
  transactionIds: string[]
  transactionCount: number
  suggestedRule: any
  confidence: number
  amount: number
  type: string
}

export function RecurrenceDetectorCard () {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const detectPatterns = async () => {
    setDetecting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/transactions/recurrence/detect', {
        method: 'POST'
      })
      const data = await res.json()

      if (data.success) {
        setPatterns(data.patterns)
        setMessage({
          type: 'success',
          text: `${data.patternsFound} padrão(ões) detectado(s) em ${data.totalAnalyzed} transações`
        })
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Erro ao detectar padrões'
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro ao detectar padrões'
      })
    } finally {
      setDetecting(false)
    }
  }

  const applyPattern = async (pattern: Pattern) => {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/transactions/recurrence/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionIds: pattern.transactionIds,
          recurrenceRule: pattern.suggestedRule
        })
      })

      const data = await res.json()

      if (data.success) {
        setMessage({
          type: 'success',
          text: data.message
        })
        // Remover padrão aplicado da lista
        setPatterns(patterns.filter(p => p.description !== pattern.description))
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Erro ao aplicar padrão'
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro ao aplicar padrão'
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value))
  }

  const getFrequencyLabel = (rule: any) => {
    if (!rule) return ''
    
    const labels: Record<string, string> = {
      MONTHLY: 'Mensal',
      WEEKLY: 'Semanal',
      YEARLY: 'Anual',
      DAILY: 'Diário'
    }

    const freq = labels[rule.frequency] || rule.frequency
    return rule.interval > 1 ? `A cada ${rule.interval} ${freq}` : freq
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Detecção Inteligente</CardTitle>
            <CardDescription>
              Identifique automaticamente transações recorrentes
            </CardDescription>
          </div>
          <Button 
            onClick={detectPatterns} 
            disabled={detecting}
            variant="outline"
          >
            {detecting ? '🔍 Analisando...' : '🔍 Detectar Padrões'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert 
            variant={message.type === 'error' ? 'destructive' : 'default'}
            className="mb-4"
          >
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {patterns.length === 0 && !detecting ? (
          <div className="text-center text-slate-500 py-8">
            <p className="mb-2">🤖 Detecte automaticamente transações recorrentes</p>
            <p className="text-sm">
              Clique em &quot;Detectar Padrões&quot; para analisar suas transações
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {patterns.map((pattern, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">
                      {pattern.description}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{pattern.transactionCount} ocorrências</span>
                      <span>•</span>
                      <span>{formatCurrency(pattern.amount)}</span>
                      <span>•</span>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {getFrequencyLabel(pattern.suggestedRule)}
                      </Badge>
                    </div>
                  </div>
                  <Badge 
                    variant={pattern.confidence >= 80 ? 'default' : 'secondary'}
                  >
                    {pattern.confidence}% confiança
                  </Badge>
                </div>

                <Button
                  onClick={() => applyPattern(pattern)}
                  disabled={loading}
                  size="sm"
                  className="w-full"
                >
                  ✅ Marcar como Recorrente
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

