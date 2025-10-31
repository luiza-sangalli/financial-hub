import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET () {
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

    // Buscar todas as transações da empresa
    const transactions = await prisma.transaction.findMany({
      where: {
        companyId: user.companyId
      },
      include: {
        category: true
      }
    })

    // Calcular estatísticas
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    // Separar receitas recorrentes e pontuais
    const recurringIncome = transactions
      .filter(t => t.type === 'INCOME' && t.isRecurring)
      .reduce((sum, t) => sum + t.amount, 0)

    const oneTimeIncome = transactions
      .filter(t => t.type === 'INCOME' && !t.isRecurring)
      .reduce((sum, t) => sum + t.amount, 0)

    // Separar despesas recorrentes (fixas) e pontuais (variáveis)
    const recurringExpenses = transactions
      .filter(t => t.type === 'EXPENSE' && t.isRecurring)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const oneTimeExpenses = transactions
      .filter(t => t.type === 'EXPENSE' && !t.isRecurring)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const netProfit = totalIncome - totalExpense

    // Transações deste mês
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const transactionsThisMonth = transactions.filter(
      t => new Date(t.date) >= startOfMonth
    ).length

    // Gastos por categoria
    const expensesByCategory: Record<string, { name: string, amount: number, color: string }> = {}
    
    transactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        const categoryName = t.category?.name || 'Sem Categoria'
        const categoryColor = t.category?.color || '#999999'
        
        if (!expensesByCategory[categoryName]) {
          expensesByCategory[categoryName] = {
            name: categoryName,
            amount: 0,
            color: categoryColor
          }
        }
        
        expensesByCategory[categoryName].amount += Math.abs(t.amount)
      })

    const categoryStats = Object.values(expensesByCategory)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    // Transações recentes
    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(t => ({
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
        } : null
      }))

    return NextResponse.json({
      success: true,
      stats: {
        totalIncome,
        totalExpense,
        netProfit,
        transactionsThisMonth,
        totalTransactions: transactions.length,
        recurringExpenses,
        oneTimeExpenses,
        recurringIncome,
        oneTimeIncome
      },
      categoryStats,
      recentTransactions
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}

