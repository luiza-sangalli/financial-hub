'use client'

import { useState, useEffect } from 'react'
import { DashboardLayoutWithSidebar } from '../layout-with-sidebar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IconTrendingUp, IconTrendingDown, IconCalendar, IconFilter, IconArrowDown, IconArrowUp } from '@tabler/icons-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  date: string
  category: { name: string; color: string } | null
}

interface AnalyticsData {
  summary: {
    totalIncome: number
    totalExpense: number
    netResult: number
    transactionCount: number
  }
  period: {
    startDate: string | null
    endDate: string | null
  }
  monthlyTimeSeries: Array<{
    month: string
    income: number
    expense: number
  }>
  topExpenseCategories: Array<{ name: string; amount: number }>
  topIncomeCategories: Array<{ name: string; amount: number }>
  highlights: {
    largestIncome: any | null
    largestExpense: any | null
  }
}

const chartConfig = {
  income: {
    label: 'Entradas',
    color: 'hsl(var(--chart-2))'
  },
  expense: {
    label: 'Saídas',
    color: 'hsl(var(--chart-1))'
  }
}

export default function TransactionsPage () {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [periodFilter, setPeriodFilter] = useState('30d')
  const [typeFilter, setTypeFilter] = useState<'all' | 'INCOME' | 'EXPENSE'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    setCurrentPage(1) // Reset page quando filtros mudarem
    fetchAnalytics()
  }, [periodFilter, typeFilter])

  useEffect(() => {
    fetchTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, periodFilter, typeFilter])

  async function fetchAnalytics () {
    try {
      setLoading(true)
      setError(null)

      const startDate = getStartDate(periodFilter)
      const params = new URLSearchParams()
      
      if (startDate) {
        params.append('startDate', startDate)
      }
      if (typeFilter !== 'all') {
        params.append('type', typeFilter)
      }

      const response = await fetch(`/api/transactions/analytics?${params}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados')
      }

      const result = await response.json()
      setData(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchTransactions () {
    try {
      setLoadingTransactions(true)

      const startDate = getStartDate(periodFilter)
      const params = new URLSearchParams()
      
      if (startDate) {
        params.append('startDate', startDate)
      }
      if (typeFilter !== 'all') {
        params.append('type', typeFilter)
      }
      params.append('limit', String(itemsPerPage))
      params.append('offset', String((currentPage - 1) * itemsPerPage))

      const response = await fetch(`/api/transactions?${params}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar transações')
      }

      const result = await response.json()
      setTransactions(result.transactions || [])
      
      // Calcular total de páginas
      const total = result.pagination?.total || 0
      setTotalPages(Math.ceil(total / itemsPerPage))
    } catch (err: any) {
      console.error('Erro ao buscar transações:', err)
    } finally {
      setLoadingTransactions(false)
    }
  }

  function getStartDate (period: string): string {
    const now = new Date()
    switch (period) {
      case '7d':
        now.setDate(now.getDate() - 7)
        break
      case '30d':
        now.setDate(now.getDate() - 30)
        break
      case '90d':
        now.setDate(now.getDate() - 90)
        break
      case '1y':
        now.setFullYear(now.getFullYear() - 1)
        break
      default:
        return ''
    }
    return now.toISOString()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const isPositiveBalance = data ? data.summary.netResult >= 0 : true
  const balanceChange = data && data.summary.totalIncome > 0
    ? ((data.summary.netResult / data.summary.totalIncome) * 100).toFixed(1)
    : '0'

  return (
    <DashboardLayoutWithSidebar
      title="Visualização Financeira"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Visualização de Transações' }
      ]}
    >
      <div className="flex-1 space-y-6">
        {/* Erro */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filtros Inline */}
        <div className="flex flex-wrap items-center gap-3 bg-muted/50 p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <IconCalendar className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium">Período:</span>
          </div>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 ml-4">
            <IconFilter className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium">Tipo:</span>
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="INCOME">Entradas</SelectItem>
              <SelectItem value="EXPENSE">Saídas</SelectItem>
            </SelectContent>
          </Select>

          {data && (
            <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
              <IconCalendar className="size-4" />
              <span>{data.summary.transactionCount} transações</span>
            </div>
          )}
        </div>

        {/* Cards de Resumo */}
        {data && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Entradas */}
            <Card className="bg-gradient-to-t from-green-50/50 to-card dark:from-green-950/20">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <IconArrowDown className="size-4 text-green-600" />
                  Total de Entradas
                </CardDescription>
                <CardTitle className="text-3xl font-bold tabular-nums text-green-600">
                  {formatCurrency(data.summary.totalIncome)}
                </CardTitle>
              </CardHeader>
              <CardFooter className="text-xs text-muted-foreground">
                Receitas do período
              </CardFooter>
            </Card>

            {/* Total Saídas */}
            <Card className="bg-gradient-to-t from-red-50/50 to-card dark:from-red-950/20">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <IconArrowUp className="size-4 text-red-600" />
                  Total de Saídas
                </CardDescription>
                <CardTitle className="text-3xl font-bold tabular-nums text-red-600">
                  {formatCurrency(data.summary.totalExpense)}
                </CardTitle>
              </CardHeader>
              <CardFooter className="text-xs text-muted-foreground">
                Despesas do período
              </CardFooter>
            </Card>

            {/* Saldo */}
            <Card className={`bg-gradient-to-t ${isPositiveBalance ? 'from-blue-50/50 dark:from-blue-950/20' : 'from-orange-50/50 dark:from-orange-950/20'} to-card`}>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center justify-between">
                  <span>Saldo do Período</span>
                  <Badge variant="outline" className={isPositiveBalance ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}>
                    {isPositiveBalance ? <IconTrendingUp className="size-3" /> : <IconTrendingDown className="size-3" />}
                    {balanceChange}%
                  </Badge>
                </CardDescription>
                <CardTitle className={`text-3xl font-bold tabular-nums ${isPositiveBalance ? 'text-blue-600' : 'text-orange-600'}`}>
                  {formatCurrency(data.summary.netResult)}
                </CardTitle>
              </CardHeader>
              <CardFooter className="text-xs text-muted-foreground">
                {isPositiveBalance ? 'Resultado positivo' : 'Atenção necessária'}
              </CardFooter>
            </Card>

            {/* Transações */}
            <Card className="bg-gradient-to-t from-violet-50/50 to-card dark:from-violet-950/20">
              <CardHeader className="pb-2">
                <CardDescription>Total de Transações</CardDescription>
                <CardTitle className="text-3xl font-bold tabular-nums text-violet-600">
                  {data.summary.transactionCount}
                </CardTitle>
              </CardHeader>
              <CardFooter className="text-xs text-muted-foreground">
                Movimentações registradas
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Gráfico de Evolução */}
        {data && data.monthlyTimeSeries && data.monthlyTimeSeries.length > 0 && (
          <Card className="@container/card">
            <CardHeader>
              <CardTitle>Evolução Mensal</CardTitle>
              <CardDescription>
                Comparativo de entradas e saídas ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <AreaChart data={data.monthlyTimeSeries}>
                  <defs>
                    <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-expense)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-expense)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => value}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="income"
                    type="natural"
                    fill="url(#fillIncome)"
                    stroke="var(--color-income)"
                    stackId="a"
                  />
                  <Area
                    dataKey="expense"
                    type="natural"
                    fill="url(#fillExpense)"
                    stroke="var(--color-expense)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 leading-none font-medium">
                {isPositiveBalance ? (
                  <>
                    Resultado positivo <IconTrendingUp className="size-4 text-green-600" />
                  </>
                ) : (
                  <>
                    Atenção ao déficit <IconTrendingDown className="size-4 text-red-600" />
                  </>
                )}
              </div>
              <div className="text-muted-foreground leading-none">
                Análise baseada em {data.summary.transactionCount} transações
              </div>
            </CardFooter>
          </Card>
        )}

        {/* Breakdown por Categoria */}
        {data && ((data.topExpenseCategories && data.topExpenseCategories.length > 0) || (data.topIncomeCategories && data.topIncomeCategories.length > 0)) && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Saídas por Categoria */}
            {data.topExpenseCategories && data.topExpenseCategories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconArrowUp className="size-5 text-red-600" />
                    Saídas por Categoria
                  </CardTitle>
                  <CardDescription>Top categorias de despesas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={data.topExpenseCategories.slice(0, 8)} layout="vertical">
                      <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} hide />
                      <YAxis dataKey="name" type="category" width={120} tickLine={false} axisLine={false} className="text-xs" />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            hideLabel
                            formatter={(value) => formatCurrency(Number(value))}
                          />
                        }
                      />
                      <Bar dataKey="amount" fill="var(--color-expense)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

            {/* Entradas por Categoria */}
            {data.topIncomeCategories && data.topIncomeCategories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconArrowDown className="size-5 text-green-600" />
                    Entradas por Categoria
                  </CardTitle>
                  <CardDescription>Top categorias de receitas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={data.topIncomeCategories.slice(0, 8)} layout="vertical">
                      <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} hide />
                      <YAxis dataKey="name" type="category" width={120} tickLine={false} axisLine={false} className="text-xs" />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            hideLabel
                            formatter={(value) => formatCurrency(Number(value))}
                          />
                        }
                      />
                      <Bar dataKey="amount" fill="var(--color-income)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Destaques */}
        {data && data.highlights && (data.highlights.largestIncome || data.highlights.largestExpense) && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.highlights.largestIncome && (
              <Card className="border-green-200 dark:border-green-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    Maior Entrada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold text-green-600 tabular-nums">
                    {formatCurrency(data.highlights.largestIncome.amount)}
                  </div>
                  <div className="text-sm">{data.highlights.largestIncome.description}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{data.highlights.largestIncome.category}</Badge>
                    <span>•</span>
                    <span>{formatDate(data.highlights.largestIncome.date)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {data.highlights.largestExpense && (
              <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">💸</span>
                    Maior Saída
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold text-red-600 tabular-nums">
                    {formatCurrency(data.highlights.largestExpense.amount)}
                  </div>
                  <div className="text-sm">{data.highlights.largestExpense.description}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{data.highlights.largestExpense.category}</Badge>
                    <span>•</span>
                    <span>{formatDate(data.highlights.largestExpense.date)}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Lista de Transações */}
        {transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>
                Histórico detalhado das suas movimentações financeiras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Descrição</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingTransactions ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Carregando transações...
                        </TableCell>
                      </TableRow>
                    ) : transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Nenhuma transação encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {transaction.type === 'INCOME' ? (
                                <IconArrowDown className="size-4 text-green-600" />
                              ) : (
                                <IconArrowUp className="size-4 text-red-600" />
                              )}
                              {transaction.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            {transaction.category ? (
                              <Badge 
                                variant="outline" 
                                style={{ 
                                  borderColor: transaction.category.color,
                                  color: transaction.category.color 
                                }}
                              >
                                {transaction.category.name}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">Sem categoria</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(transaction.date)}
                          </TableCell>
                          <TableCell className={`text-right font-mono font-semibold tabular-nums ${
                            transaction.type === 'INCOME' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {transaction.type === 'INCOME' ? '+' : '-'}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            {totalPages > 1 && (
              <CardFooter className="flex items-center justify-between border-t px-6 py-4">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loadingTransactions}
                  >
                    <IconChevronLeft className="size-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || loadingTransactions}
                  >
                    Próxima
                    <IconChevronRight className="size-4" />
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        )}

        {/* Estado vazio */}
        {!loading && data && data.summary.transactionCount === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="text-6xl">📊</div>
                <p className="text-lg text-muted-foreground">
                  Nenhuma transação encontrada para o período selecionado
                </p>
                <Button asChild>
                  <a href="/dashboard/import">
                    Importar Transações
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayoutWithSidebar>
  )
}
