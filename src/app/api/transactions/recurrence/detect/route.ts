import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { recurrenceDetector } from '@/lib/recurrence-detector'

export async function POST () {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true }
    })

    if (!user?.companyId) {
      return NextResponse.json(
        { error: 'Usuário sem empresa associada' },
        { status: 400 }
      )
    }

    // Buscar todas as transações não-recorrentes
    const transactions = await prisma.transaction.findMany({
      where: {
        companyId: user.companyId,
        isRecurring: false
      },
      orderBy: { date: 'asc' }
    })

    // Detectar padrões
    const patterns = recurrenceDetector.detectPatterns(transactions)

    // Filtrar padrões com confiança mínima de 60%
    const suggestedPatterns = patterns
      .filter(p => p.confidence >= 0.6)
      .map(p => ({
        description: p.description,
        transactionIds: p.transactions.map(t => t.id),
        transactionCount: p.transactions.length,
        suggestedRule: p.suggestedRule,
        confidence: Math.round(p.confidence * 100),
        amount: p.transactions[0]?.amount,
        type: p.transactions[0]?.type,
        category: null // Será preenchido depois se necessário
      }))

    return NextResponse.json({
      success: true,
      patterns: suggestedPatterns,
      totalAnalyzed: transactions.length,
      patternsFound: suggestedPatterns.length
    })
  } catch (error) {
    console.error('Erro ao detectar recorrências:', error)
    return NextResponse.json(
      { error: 'Erro ao detectar recorrências' },
      { status: 500 }
    )
  }
}

