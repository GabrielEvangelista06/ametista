import { getServerSession } from 'next-auth'

import { authConfig } from '@/lib/auth'

import { ProfileSettingsForm } from './_components/ProfileSettingsForm'

export default async function SettingsPage() {
  const session = await getServerSession(authConfig)

  return <ProfileSettingsForm user={session?.user} />
}
