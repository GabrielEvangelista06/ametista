'use client'

import { usePathname } from 'next/navigation'
import { PropsWithChildren, useEffect, useState } from 'react'

import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderTitle,
  PageLayoutMain,
} from '@/components/layouts/PageLayout'
import { Button } from '@/components/ui/button'
import { CircleChevronDownIcon, CircleChevronUpIcon } from 'lucide-react'

import { SettingsSidebar } from './_components/SettingsSidebar'

export default function SettingsLayout({ children }: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <PageLayout>
      <PageLayoutHeader>
        <PageLayoutHeaderTitle>Configurações</PageLayoutHeaderTitle>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <CircleChevronUpIcon className="h-6 w-6" />
          ) : (
            <CircleChevronDownIcon className="h-6 w-6" />
          )}
        </Button>
      </PageLayoutHeader>
      <PageLayoutMain>
        <div className="container max-w-screen-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[16rem_1fr] md:gap-12">
            <aside
              className={`
                md:w-64 
                ${sidebarOpen ? 'block' : 'hidden'} 
                rounded-b-lg border-b
                border-l border-r
                p-4 shadow-sm md:mb-0 md:block md:border-none
                md:p-0 md:shadow-none
              `}
            >
              <SettingsSidebar />
            </aside>
            <div className="mt-6 flex-1">{children}</div>
          </div>
        </div>
      </PageLayoutMain>
    </PageLayout>
  )
}
