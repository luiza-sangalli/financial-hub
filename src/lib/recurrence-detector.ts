import { Transaction } from '@prisma/client'
import { RecurrenceRule } from '@/types'

interface TransactionPattern {
  description: string
  transactions: Transaction[]
  suggestedRule: RecurrenceRule | null
  confidence: number
}

/**
 * Detecta padrões de transações recorrentes
 */
export class RecurrenceDetector {
  private readonly SIMILARITY_THRESHOLD = 0.8
  private readonly MIN_OCCURRENCES = 2
  private readonly MAX_DAY_VARIANCE = 3

  /**
   * Analisa transações e detecta padrões recorrentes
   */
  detectPatterns (transactions: Transaction[]): TransactionPattern[] {
    const patterns: TransactionPattern[] = []
    const processedIds = new Set<string>()

    // Agrupar por descrição similar
    const groups = this.groupByDescription(transactions)

    for (const [description, groupTransactions] of Object.entries(groups)) {
      if (groupTransactions.length < this.MIN_OCCURRENCES) continue

      // Pular transações já processadas
      if (groupTransactions.some(t => processedIds.has(t.id))) continue

      // Ordenar por data
      const sorted = groupTransactions.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      // Analisar intervalos entre transações
      const intervals = this.calculateIntervals(sorted)
      const rule = this.detectFrequency(sorted, intervals)

      if (rule) {
        const confidence = this.calculateConfidence(sorted, intervals)
        
        patterns.push({
          description,
          transactions: sorted,
          suggestedRule: rule,
          confidence
        })

        sorted.forEach(t => processedIds.add(t.id))
      }
    }

    return patterns.sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * Agrupa transações por descrição similar
   */
  private groupByDescription (transactions: Transaction[]): Record<string, Transaction[]> {
    const groups: Record<string, Transaction[]> = {}

    for (const transaction of transactions) {
      const normalized = this.normalizeDescription(transaction.description)
      
      if (!groups[normalized]) {
        groups[normalized] = []
      }
      
      groups[normalized].push(transaction)
    }

    return groups
  }

  /**
   * Normaliza descrição para comparação
   */
  private normalizeDescription (description: string): string {
    return description
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\d{2}\/\d{2}\/\d{4}/g, '') // Remove datas
      .replace(/\d{4}-\d{2}-\d{2}/g, '') // Remove datas ISO
      .replace(/\b(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\b/gi, '') // Remove meses
      .trim()
  }

  /**
   * Calcula intervalos entre transações em dias
   */
  private calculateIntervals (transactions: Transaction[]): number[] {
    const intervals: number[] = []

    for (let i = 1; i < transactions.length; i++) {
      const diff = Math.abs(
        new Date(transactions[i].date).getTime() - 
        new Date(transactions[i - 1].date).getTime()
      )
      intervals.push(Math.round(diff / (1000 * 60 * 60 * 24)))
    }

    return intervals
  }

  /**
   * Detecta frequência baseada nos intervalos
   */
  private detectFrequency (
    transactions: Transaction[], 
    intervals: number[]
  ): RecurrenceRule | null {
    if (intervals.length === 0) return null

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance = this.calculateVariance(intervals)

    // Se a variância é muito alta, não é um padrão confiável
    if (variance > 10) return null

    // Detectar frequência
    let frequency: RecurrenceRule['frequency']
    let interval = 1

    if (avgInterval >= 27 && avgInterval <= 33) {
      frequency = 'MONTHLY'
      interval = 1
    } else if (avgInterval >= 6 && avgInterval <= 8) {
      frequency = 'WEEKLY'
      interval = 1
    } else if (avgInterval >= 13 && avgInterval <= 15) {
      frequency = 'WEEKLY'
      interval = 2
    } else if (avgInterval >= 358 && avgInterval <= 368) {
      frequency = 'YEARLY'
      interval = 1
    } else if (avgInterval >= 58 && avgInterval <= 65) {
      frequency = 'MONTHLY'
      interval = 2
    } else if (avgInterval >= 88 && avgInterval <= 95) {
      frequency = 'MONTHLY'
      interval = 3
    } else {
      return null
    }

    // Pegar o dia do mês mais comum
    const days = transactions.map(t => new Date(t.date).getDate())
    const dayOfMonth = this.getMostCommon(days)

    return {
      frequency,
      interval,
      startDate: new Date(transactions[0].date).toISOString(),
      dayOfMonth
    }
  }

  /**
   * Calcula variância dos intervalos
   */
  private calculateVariance (intervals: number[]): number {
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const squaredDiffs = intervals.map(interval => Math.pow(interval - avg, 2))
    return squaredDiffs.reduce((a, b) => a + b, 0) / intervals.length
  }

  /**
   * Retorna o valor mais comum em um array
   */
  private getMostCommon (arr: number[]): number {
    const counts: Record<number, number> = {}
    
    arr.forEach(val => {
      counts[val] = (counts[val] || 0) + 1
    })

    let maxCount = 0
    let mostCommon = arr[0]

    Object.entries(counts).forEach(([val, count]) => {
      if (count > maxCount) {
        maxCount = count
        mostCommon = parseInt(val)
      }
    })

    return mostCommon
  }

  /**
   * Calcula confiança do padrão detectado (0-1)
   */
  private calculateConfidence (transactions: Transaction[], intervals: number[]): number {
    let confidence = 0

    // Mais transações = maior confiança
    confidence += Math.min(transactions.length * 0.2, 0.4)

    // Menor variância = maior confiança
    const variance = this.calculateVariance(intervals)
    confidence += Math.max(0, 0.3 - (variance * 0.03))

    // Valores consistentes = maior confiança
    const amounts = transactions.map(t => Math.abs(t.amount))
    const amountVariance = this.calculateVariance(amounts)
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length
    const relativeVariance = avgAmount > 0 ? amountVariance / avgAmount : 1
    confidence += Math.max(0, 0.3 - relativeVariance)

    return Math.min(confidence, 1)
  }

  /**
   * Verifica se uma transação corresponde a um padrão recorrente
   */
  matchesPattern (
    transaction: Transaction,
    pattern: TransactionPattern
  ): boolean {
    const normalizedDesc = this.normalizeDescription(transaction.description)
    const patternDesc = this.normalizeDescription(pattern.description)
    
    if (normalizedDesc !== patternDesc) return false

    const amountDiff = Math.abs(
      Math.abs(transaction.amount) - 
      Math.abs(pattern.transactions[0].amount)
    )
    const avgAmount = Math.abs(pattern.transactions[0].amount)
    
    // Aceitar variação de até 10% no valor
    return amountDiff / avgAmount < 0.1
  }
}

export const recurrenceDetector = new RecurrenceDetector()

