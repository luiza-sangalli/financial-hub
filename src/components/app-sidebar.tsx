"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFileUpload,
  IconSettings,
  IconHelp,
  IconCurrencyDollar,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const data = {
    user: user || {
      name: "Usuário",
      email: "usuario@example.com",
      avatar: undefined,
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Visualização",
        url: "/dashboard/transactions",
        icon: IconChartBar,
      },
      {
        title: "Importar Dados",
        url: "/dashboard/import",
        icon: IconFileUpload,
      },
    ],
    navSecondary: [
      {
        title: "Configurações",
        url: "/dashboard/settings",
        icon: IconSettings,
      },
      {
        title: "Ajuda",
        url: "/dashboard/help",
        icon: IconHelp,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconCurrencyDollar className="!size-5" />
                <span className="text-base font-semibold">FinancialHub</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
