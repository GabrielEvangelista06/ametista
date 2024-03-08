import { getServerSession } from 'next-auth'

import { authConfig } from '@/lib/auth'

import { UserInfo } from '../_components/UserInfo'

export default async function AppPage() {
  const session = await getServerSession(authConfig)
  return (
    <main className="flex min-h-screen items-center justify-center">
      <UserInfo user={session?.user} />
    </main>
  )
}
