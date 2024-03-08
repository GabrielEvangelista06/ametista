import { getServerSession } from 'next-auth'

import { authConfig } from '@/lib/auth'

export default async function AdminPage() {
  const session = await getServerSession(authConfig)
  console.log('🚀 ~ AdminPage ~ session:', session)

  if (session?.user) {
    return (
      <div className="flex items-center text-center">
        <h1>
          Bem vindo a Ametista {session?.user.username || session.user.name}!
        </h1>
      </div>
    )
  }

  return (
    <div className="flex items-center text-center">
      <h1>Você não está logado!</h1>
    </div>
  )
}
