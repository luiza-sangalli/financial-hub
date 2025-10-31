import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET (req: NextRequest) {
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

    const { searchParams } = new URL(req.url)
    const fileId = searchParams.get('fileId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const type = searchParams.get('type') as 'INCOME' | 'EXPENSE' | null
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Filtros
    const where: Record<string, unknown> = {
      companyId: user.companyId
    }

    if (fileId) {
      where.fileId = fileId
    }

    const dateFilter: Record<string, Date> = {}
    if (startDate) {
      dateFilter.gte = new Date(startDate)
    }

    if (endDate) {
      dateFilter.lte = new Date(endDate)
    }

    if (Object.keys(dateFilter).length > 0) {
      where.date = dateFilter
    }

    if (type) {
      where.type = type
    }

    // Buscar transações
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: true,
          file: {
            select: {
              originalName: true
            }
          }
        },
        orderBy: { date: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.transaction.count({ where })
    ])

    return NextResponse.json({
      success: true,
      transactions: transactions.map(t => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        type: t.type,
        date: t.date,
        isRecurring: t.isRecurring || false,
        category: t.category ? {
          id: t.category.id,
          name: t.category.name,
          color: t.category.color
        } : null,
        fileName: t.file?.originalName,
        createdAt: t.createdAt
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar transações' },
      { status: 500 }
    )
  }
}

