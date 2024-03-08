'use client'

import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type UserInfoProps = {
  user: (Session['user'] & { username: string }) | undefined
}

export function UserInfo({ user }: UserInfoProps) {
  if (!user) return

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Avatar>
        <AvatarImage src={user.image || ''} />
      </Avatar>
      <span>{user.username || user.email}</span>

      <Button variant="outline" onClick={() => signOut()}>
        Sair
      </Button>
    </div>
  )
}
