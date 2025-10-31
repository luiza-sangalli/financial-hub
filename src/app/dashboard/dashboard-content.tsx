'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { CategoryChart } from '@/components/dashboard/category-chart'
import { ExpenseBreakdown } from '@/components/dashboard/expense-breakdown'
import { IconFileUpload, IconChartBar } from '@tabler/icons-react'

export function DashboardContent() {
  return (
    <div className="flex-1 space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link href="/dashboard/import">
          <Button className="gap-2">
            <IconFileUpload className="h-4 w-4" />
            Importar Dados
          </Button>
        </Link>
        <Link href="/dashboard/transactions">
          <Button variant="outline" className="gap-2">
            <IconChartBar className="h-4 w-4" />
            Visualizar Entradas e Saídas
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseBreakdown />
        <CategoryChart />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  )
}

