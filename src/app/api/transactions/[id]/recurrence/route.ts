import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH (
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { isRecurring, recurrenceRule } = await req.json()

    // Verificar se a transação existe e pertence à empresa do usuário
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: params.id,
        companyId: user.companyId
      }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      )
    }

    // Atualizar transação
    const updated = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        isRecurring,
        recurrenceRule: isRecurring ? recurrenceRule : null
      },
      include: {
        category: true
      }
    })

    return NextResponse.json({
      success: true,
      transaction: updated
    })
  } catch (error) {
    console.error('Erro ao atualizar recorrência:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar recorrência' },
      { status: 500 }
    )
  }
}

export async function DELETE (
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Remover recorrência da transação
    const updated = await prisma.transaction.update({
      where: { 
        id: params.id
      },
      data: {
        isRecurring: false,
        recurrenceRule: null
      }
    })

    return NextResponse.json({
      success: true,
      transaction: updated
    })
  } catch (error) {
    console.error('Erro ao remover recorrência:', error)
    return NextResponse.json(
      { error: 'Erro ao remover recorrência' },
      { status: 500 }
    )
  }
}

