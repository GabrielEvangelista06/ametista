'use client'

import { Session } from 'next-auth'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

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
import { AnimatePresence, motion } from 'framer-motion'
import {
  ActivityIcon,
  CreditCardIcon,
  LandmarkIcon,
  LayoutDashboardIcon,
  ReceiptTextIcon,
  TagIcon,
} from 'lucide-react'

import Logo from '../../../../public/images/logo1.png'
import { UserDropdown } from './UserDropdown'

type MainSidebarProps = {
  user: (Session['user'] & { username: string }) | undefined
}

export function MainSidebar({ user }: MainSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

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
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 lg:relative lg:inset-auto"
          >
            <DashboardSidebar className="flex h-full w-64 flex-col bg-background shadow-lg lg:space-y-6 lg:border-r lg:border-border lg:shadow-none">
              <DashboardSidebarHeader>
                <Image
                  src={Logo}
                  width={50}
                  height={50}
                  alt="Logo Ametista"
                  className="ml-4 lg:ml-0"
                />
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
                      active={isActive('/app/cards')}
                    >
                      <CreditCardIcon className="mr-3 h-3 w-3" />
                      Cartões
                    </DashboardSidebarNavLink>
                    <DashboardSidebarNavLink
                      index={5}
                      href="/app/bills"
                      active={isActive('/app/bills')}
                    >
                      <ReceiptTextIcon className="mr-3 h-3 w-3" />
                      Faturas
                    </DashboardSidebarNavLink>
                    <DashboardSidebarNavLink
                      index={6}
                      href="/app/categories"
                      active={isActive('/app/categories')}
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
                      index={7}
                      href="/"
                      active={isActive('/')}
                    >
                      Dar Feedback
                    </DashboardSidebarNavLink>
                    <DashboardSidebarNavLink
                      index={8}
                      href="/"
                      active={isActive('/')}
                    >
                      Precisa de ajuda?
                    </DashboardSidebarNavLink>
                    <DashboardSidebarNavLink
                      index={9}
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
          </motion.div>
        )}
      </AnimatePresence>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  )
}
