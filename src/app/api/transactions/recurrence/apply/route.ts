import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST (req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user?.companyId) {
      return NextResponse.json(
        { error: 'Usuário sem empresa associada' },
        { status: 400 }
      )
    }

    const { transactionIds, recurrenceRule } = await req.json()

    if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
      return NextResponse.json(
        { error: 'IDs de transações inválidos' },
        { status: 400 }
      )
    }

    if (!recurrenceRule) {
      return NextResponse.json(
        { error: 'Regra de recorrência não fornecida' },
        { status: 400 }
      )
    }

    // Atualizar todas as transações para serem recorrentes
    const result = await prisma.transaction.updateMany({
      where: {
        id: { in: transactionIds },
        companyId: user.companyId
      },
      data: {
        isRecurring: true,
        recurrenceRule: recurrenceRule
      }
    })

    return NextResponse.json({
      success: true,
      updated: result.count,
      message: `${result.count} transação(ões) marcada(s) como recorrente(s)`
    })
  } catch (error) {
    console.error('Erro ao aplicar recorrência:', error)
    return NextResponse.json(
      { error: 'Erro ao aplicar recorrência' },
      { status: 500 }
    )
  }
}

