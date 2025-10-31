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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const categoryId = searchParams.get('categoryId')
    const type = searchParams.get('type') as 'INCOME' | 'EXPENSE' | null

    // Construir filtros
    const where: Record<string, unknown> = {
      companyId: user.companyId
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

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (type) {
      where.type = type
    }

    // Buscar transações
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { date: 'asc' }
    })

    // Agrupar por mês
    const monthlyData: Record<string, { income: number, expense: number, net: number, count: number }> = {}
    
    transactions.forEach(t => {
      const date = new Date(t.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0, net: 0, count: 0 }
      }

      if (t.type === 'INCOME') {
        monthlyData[monthKey].income += t.amount
        monthlyData[monthKey].net += t.amount
      } else {
        monthlyData[monthKey].expense += Math.abs(t.amount)
        monthlyData[monthKey].net -= Math.abs(t.amount)
      }

      monthlyData[monthKey].count++
    })

    // Converter para array ordenado
    const monthlyTimeSeries = Object.entries(monthlyData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, data]) => ({
        month,
        ...data
      }))

    // Estatísticas gerais do período
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const netResult = totalIncome - totalExpense

    // Separar recorrentes e pontuais
    const recurringIncome = transactions
      .filter(t => t.type === 'INCOME' && t.isRecurring)
      .reduce((sum, t) => sum + t.amount, 0)

    const recurringExpense = transactions
      .filter(t => t.type === 'EXPENSE' && t.isRecurring)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    // Top categorias de despesa
    const expensesByCategory: Record<string, { name: string, amount: number, color: string, count: number }> = {}
    
    transactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        const categoryName = t.category?.name || 'Sem Categoria'
        const categoryColor = t.category?.color || '#999999'
        
        if (!expensesByCategory[categoryName]) {
          expensesByCategory[categoryName] = {
            name: categoryName,
            amount: 0,
            color: categoryColor,
            count: 0
          }
        }
        
        expensesByCategory[categoryName].amount += Math.abs(t.amount)
        expensesByCategory[categoryName].count++
      })

    const topExpenseCategories = Object.values(expensesByCategory)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)

    // Top categorias de receita
    const incomeByCategory: Record<string, { name: string, amount: number, color: string, count: number }> = {}
    
    transactions
      .filter(t => t.type === 'INCOME')
      .forEach(t => {
        const categoryName = t.category?.name || 'Sem Categoria'
        const categoryColor = t.category?.color || '#22c55e'
        
        if (!incomeByCategory[categoryName]) {
          incomeByCategory[categoryName] = {
            name: categoryName,
            amount: 0,
            color: categoryColor,
            count: 0
          }
        }
        
        incomeByCategory[categoryName].amount += t.amount
        incomeByCategory[categoryName].count++
      })

    const topIncomeCategories = Object.values(incomeByCategory)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)

    // Maior receita e despesa individual
    const largestIncome = transactions
      .filter(t => t.type === 'INCOME')
      .sort((a, b) => b.amount - a.amount)[0]

    const largestExpense = transactions
      .filter(t => t.type === 'EXPENSE')
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0]

    return NextResponse.json({
      success: true,
      period: {
        startDate: startDate || transactions[0]?.date || null,
        endDate: endDate || transactions[transactions.length - 1]?.date || null
      },
      summary: {
        totalIncome,
        totalExpense,
        netResult,
        recurringIncome,
        recurringExpense,
        transactionCount: transactions.length,
        averageIncome: transactions.filter(t => t.type === 'INCOME').length > 0
          ? totalIncome / transactions.filter(t => t.type === 'INCOME').length
          : 0,
        averageExpense: transactions.filter(t => t.type === 'EXPENSE').length > 0
          ? totalExpense / transactions.filter(t => t.type === 'EXPENSE').length
          : 0
      },
      monthlyTimeSeries,
      topExpenseCategories,
      topIncomeCategories,
      highlights: {
        largestIncome: largestIncome ? {
          description: largestIncome.description,
          amount: largestIncome.amount,
          date: largestIncome.date,
          category: largestIncome.category?.name
        } : null,
        largestExpense: largestExpense ? {
          description: largestExpense.description,
          amount: Math.abs(largestExpense.amount),
          date: largestExpense.date,
          category: largestExpense.category?.name
        } : null
      }
    })
  } catch (error) {
    console.error('Erro ao buscar analytics:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar analytics' },
      { status: 500 }
    )
  }
}

