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

    // Buscar arquivos da empresa
    const files = await prisma.file.findMany({
      where: { companyId: user.companyId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      files: files.map(file => ({
        id: file.id,
        name: file.originalName,
        size: file.size,
        status: file.status,
        processedRows: file.processedRows,
        successfulRows: file.successfulRows,
        failedRows: file.failedRows,
        transactionsCount: file._count.transactions,
        errorMessage: file.errorMessage,
        processedAt: file.processedAt,
        createdAt: file.createdAt
      }))
    })
  } catch (error) {
    console.error('Erro ao buscar arquivos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar arquivos' },
      { status: 500 }
    )
  }
}

