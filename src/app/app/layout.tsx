import { getServerSession } from 'next-auth'
import { PropsWithChildren } from 'react'

import { authConfig } from '@/lib/auth'

import { MainSidebar } from './_components/MainSidebar'

export default async function Layout({ children }: PropsWithChildren) {
  const session = await getServerSession(authConfig)
  return (
    <div className="grid lg:grid-cols-[16rem_1fr]">
      <MainSidebar user={session?.user} />
      <main>{children}</main>
    </div>
  )
}
