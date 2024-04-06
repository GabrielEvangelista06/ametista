import { PropsWithChildren } from 'react'

import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderTitle,
  PageLayoutMain,
} from '@/components/layouts/PageLayout'

import { SettingsSidebar } from './_components/SettingsSidebar'

export default function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <PageLayout>
      <PageLayoutHeader>
        <PageLayoutHeaderTitle>Configurações</PageLayoutHeaderTitle>
      </PageLayoutHeader>
      <PageLayoutMain>
        <div className="container max-w-screen-lg">
          <div className="grid grid-cols-[16rem_1fr] gap-12">
            <aside>
              <SettingsSidebar />
            </aside>
            <div>{children}</div>
          </div>
        </div>
      </PageLayoutMain>
    </PageLayout>
  )
}
