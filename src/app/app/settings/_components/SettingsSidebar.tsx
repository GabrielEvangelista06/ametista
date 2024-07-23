'use client'

import { usePathname } from 'next/navigation'

import {
  DashboardSidebar,
  DashboardSidebarMain,
  DashboardSidebarNav,
  DashboardSidebarNavLink,
} from '@/components/layouts/Sidebar'

export function SettingsSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <DashboardSidebar>
      <DashboardSidebarNav>
        <DashboardSidebarMain>
          <DashboardSidebarNavLink
            href="/app/settings"
            index={1}
            active={isActive('/app/settings')}
          >
            Meu perfil
          </DashboardSidebarNavLink>
          <DashboardSidebarNavLink
            href="/app/settings/appearance"
            index={2}
            active={isActive('/app/settings/appearance')}
          >
            Aparência
          </DashboardSidebarNavLink>
          <DashboardSidebarNavLink
            href="/app/settings/subscription"
            index={3}
            active={isActive('/app/settings/subscription')}
          >
            Assinatura
          </DashboardSidebarNavLink>
        </DashboardSidebarMain>
      </DashboardSidebarNav>
    </DashboardSidebar>
  )
}
