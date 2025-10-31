'use client'

import { DashboardLayoutWithSidebar } from '../layout-with-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconSettings } from '@tabler/icons-react'

export default function SettingsPage () {
  return (
    <DashboardLayoutWithSidebar
      title="Configurações"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Configurações' }
      ]}
    >
      <div className="flex-1 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <IconSettings className="h-6 w-6 text-slate-600" />
              <div>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>
                  Gerencie as configurações da sua conta e preferências
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="py-12 text-center">
              <p className="text-slate-500 mb-2">
                Esta página está em desenvolvimento
              </p>
              <p className="text-sm text-slate-400">
                Em breve você poderá configurar sua conta, categorias, notificações e mais.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayoutWithSidebar>
  )
}

