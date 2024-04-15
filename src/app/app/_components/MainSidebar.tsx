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
} from '@/components/layouts/Sidebar'
import { Button } from '@/components/ui/button'
import { Cross2Icon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'
import {
  ActivityIcon,
  CreditCardIcon,
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
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
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
              <DashboardSidebarNavLink
                index={1}
                href="/app"
                active={isActive('/app')}
              >
                <LayoutDashboardIcon className="mr-3 h-3 w-3" />
                Dashboard
              </DashboardSidebarNavLink>
              <DashboardSidebarNavLink
                index={2}
                href="/app/transactions"
                active={isActive('/app/transactions')}
              >
                <ActivityIcon className="mr-3 h-3 w-3" />
                Transações
              </DashboardSidebarNavLink>
              <DashboardSidebarNavLink
                index={3}
                href="/app/bank-accounts"
                active={isActive('/app/bank-accounts')}
              >
                <LandmarkIcon className="mr-3 h-3 w-3" />
                Contas
              </DashboardSidebarNavLink>
              <DashboardSidebarNavLink
                index={4}
                href="/app/cards"
                active={isActive('/app/card')}
              >
                <CreditCardIcon className="mr-3 h-3 w-3" />
                Cartões
              </DashboardSidebarNavLink>
              <DashboardSidebarNavLink
                index={5}
                href="/app/tags"
                active={isActive('/app/tags')}
              >
                <TagIcon className="mr-3 h-3 w-3" />
                Categorias
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
              <DashboardSidebarNavLink
                index={6}
                href="/"
                active={isActive('/')}
              >
                Dar Feedback
              </DashboardSidebarNavLink>
              <DashboardSidebarNavLink
                index={7}
                href="/"
                active={isActive('/')}
              >
                Precisa de ajuda?
              </DashboardSidebarNavLink>
              <DashboardSidebarNavLink
                index={8}
                href="/"
                active={isActive('/')}
              >
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
