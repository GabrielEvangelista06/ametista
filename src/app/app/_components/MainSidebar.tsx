'use client'

import { Session } from 'next-auth'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import {
  DashboardSidebar,
  DashboardSidebarFooter,
  DashboardSidebarHeader,
  DashboardSidebarMain,
  DashboardSidebarNav,
  DashboardSidebarNavHeader,
  DashboardSidebarNavHeaderTitle,
  DashboardSidebarNavLink,
  DashboardSidebarNavMain,
} from '@/components/dashboard/DashboardSidebar'
import { ModeToggle } from '@/components/ModeToggle'
import { HomeIcon, MixerHorizontalIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'

import Logo from '../../../../public/images/logo1.png'
import { UserDropdown } from './UserDropdown'

type MainSidebarProps = {
  user: (Session['user'] & { username: string }) | undefined
}

export function MainSidebar({ user }: MainSidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <DashboardSidebar>
      <DashboardSidebarHeader>
        <motion.div
          className="flex h-12 items-center justify-between"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ModeToggle />
          <Image
            src={Logo}
            width={50}
            height={50}
            alt="Logo Ametista"
            className="mr-1 mt-1"
          />
        </motion.div>
      </DashboardSidebarHeader>
      <DashboardSidebarMain className="flex flex-grow flex-col">
        <DashboardSidebarNav>
          <DashboardSidebarNavMain>
            <DashboardSidebarNavLink href="/app" active={isActive('/app')}>
              <HomeIcon className="mr-3 h-3 w-3" />
              Dashboard
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink
              href="/app/settings"
              active={isActive('/app/settings')}
            >
              <MixerHorizontalIcon className="mr-3 h-3 w-3" />
              Configurações
            </DashboardSidebarNavLink>
          </DashboardSidebarNavMain>
        </DashboardSidebarNav>

        <DashboardSidebarNav className="mt-auto">
          <DashboardSidebarNavHeader>
            <DashboardSidebarNavHeaderTitle>
              Links Extras
            </DashboardSidebarNavHeaderTitle>
          </DashboardSidebarNavHeader>
          <DashboardSidebarNavMain>
            <DashboardSidebarNavLink href="/" active={isActive('/')}>
              Precisa de ajuda?
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink href="/" active={isActive('/')}>
              Site
            </DashboardSidebarNavLink>
          </DashboardSidebarNavMain>
        </DashboardSidebarNav>
      </DashboardSidebarMain>
      <DashboardSidebarFooter>
        <UserDropdown user={user} />
      </DashboardSidebarFooter>
    </DashboardSidebar>
  )
}
