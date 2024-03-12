'use client'

import { Session } from 'next-auth'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

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
import { Button } from '@/components/ui/button'
import { Cross2Icon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'
import {
  ActivityIcon,
  Goal,
  LandmarkIcon,
  LayoutDashboardIcon,
  TagIcon,
} from 'lucide-react'

import Logo from '../../../../public/images/logo1.png'
import { UserDropdown } from './UserDropdown'

type MainSidebarProps = {
  user: (Session['user'] & { username: string }) | undefined
}

export function MainSidebar({ user }: MainSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <>
      <Button
        onClick={toggleSidebar}
        variant="outline"
        size="icon"
        className="z-50 m-1 lg:hidden"
      >
        {isSidebarOpen ? <Cross2Icon /> : <HamburgerMenuIcon />}
      </Button>
      <DashboardSidebar
        className={`${isSidebarOpen ? 'fixed inset-0 z-40 flex w-full flex-col bg-background' : 'hidden lg:flex lg:flex-col lg:space-y-6 lg:border-r lg:border-border'}`}
      >
        <DashboardSidebarHeader>
          <motion.div
            className="mt-8 flex h-12 items-center justify-between lg:mt-0"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1 }}
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
                <LayoutDashboardIcon className="mr-3 h-3 w-3" />
                Dashboard
              </DashboardSidebarNavLink>
              <DashboardSidebarNavLink
                href="/app/transactions"
                active={isActive('/app/transactions')}
              >
                <ActivityIcon className="mr-3 h-3 w-3" />
                Transações
              </DashboardSidebarNavLink>
              <DashboardSidebarNavLink
                href="/app/tags"
                active={isActive('/app/tags')}
              >
                <LandmarkIcon className="mr-3 h-3 w-3" />
                Contas
              </DashboardSidebarNavLink>
              <DashboardSidebarNavLink
                href="/app/goals"
                active={isActive('/app/goals')}
              >
                <Goal className="mr-3 h-3 w-3" />
                Metas
              </DashboardSidebarNavLink>
              <DashboardSidebarNavLink
                href="/app/tags"
                active={isActive('/app/tags')}
              >
                <TagIcon className="mr-3 h-3 w-3" />
                Tags
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
    </>
  )
}
