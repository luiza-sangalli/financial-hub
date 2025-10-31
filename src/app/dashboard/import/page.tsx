'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/file-upload'
import { FileHistory } from '@/components/file-history'
import { TransactionsList } from '@/components/transactions-list'
import { DashboardLayoutWithSidebar } from '../layout-with-sidebar'

export default function ImportPage () {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleUploadComplete = () => {
    // Trigger refresh nos componentes
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <DashboardLayoutWithSidebar
      title="Importação de Dados"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Importar Dados' }
      ]}
    >
      <div className="flex-1 space-y-6">
        <div>
          <p className="text-slate-600">
            Importe suas transações financeiras de arquivos CSV ou Excel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FileUpload onUploadComplete={handleUploadComplete} />
          <FileHistory refreshTrigger={refreshTrigger} />
        </div>

        <TransactionsList refreshTrigger={refreshTrigger} limit={20} />
      </div>
    </DashboardLayoutWithSidebar>
  )
}

