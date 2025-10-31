'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface RecurrenceToggleProps {
  transactionId: string
  isRecurring: boolean
  onUpdate?: () => void
}

export function RecurrenceToggle ({ transactionId, isRecurring, onUpdate }: RecurrenceToggleProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [frequency, setFrequency] = useState('MONTHLY')
  const [interval, setInterval] = useState(1)

  const handleToggle = async () => {
    if (isRecurring) {
      // Remover recorrência
      await removeRecurrence()
    } else {
      // Abrir modal para configurar
      setOpen(true)
    }
  }

  const removeRecurrence = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/transactions/${transactionId}/recurrence`, {
        method: 'DELETE'
      })

      if (res.ok) {
        onUpdate?.()
      }
    } catch (error) {
      console.error('Erro ao remover recorrência:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyRecurrence = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/transactions/${transactionId}/recurrence`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isRecurring: true,
          recurrenceRule: {
            frequency,
            interval,
            startDate: new Date().toISOString()
          }
        })
      })

      if (res.ok) {
        setOpen(false)
        onUpdate?.()
      }
    } catch (error) {
      console.error('Erro ao aplicar recorrência:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant={isRecurring ? 'default' : 'outline'}
        size="sm"
        onClick={handleToggle}
        disabled={loading}
        className="text-xs h-7"
      >
        {isRecurring ? '🔄 Recorrente' : '➕ Marcar Recorrente'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Recorrência</DialogTitle>
            <DialogDescription>
              Defina com que frequência esta transação se repete
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Frequência</Label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="MONTHLY">Mensal</option>
                <option value="WEEKLY">Semanal</option>
                <option value="YEARLY">Anual</option>
                <option value="DAILY">Diário</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Intervalo</Label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value))}
                  className="w-20 p-2 border rounded-md"
                />
                <span className="text-sm text-slate-600">
                  {frequency === 'MONTHLY' && `mês(es)`}
                  {frequency === 'WEEKLY' && `semana(s)`}
                  {frequency === 'YEARLY' && `ano(s)`}
                  {frequency === 'DAILY' && `dia(s)`}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Exemplo:</strong>{' '}
                {interval === 1 ? (
                  <>
                    {frequency === 'MONTHLY' && 'Todo mês'}
                    {frequency === 'WEEKLY' && 'Toda semana'}
                    {frequency === 'YEARLY' && 'Todo ano'}
                    {frequency === 'DAILY' && 'Todo dia'}
                  </>
                ) : (
                  <>
                    A cada {interval}{' '}
                    {frequency === 'MONTHLY' && 'meses'}
                    {frequency === 'WEEKLY' && 'semanas'}
                    {frequency === 'YEARLY' && 'anos'}
                    {frequency === 'DAILY' && 'dias'}
                  </>
                )}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={applyRecurrence} disabled={loading}>
              {loading ? 'Salvando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

