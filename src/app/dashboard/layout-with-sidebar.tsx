'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { useSession } from 'next-auth/react'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function DashboardLayoutWithSidebar({ children, title, breadcrumbs }: DashboardLayoutProps) {
  const { data: session } = useSession()

  const user = session?.user
    ? {
        name: session.user.name || 'Usuário',
        email: session.user.email || '',
        avatar: session.user.image
      }
    : undefined

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <SiteHeader title={title} breadcrumbs={breadcrumbs} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

