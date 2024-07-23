'use server'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authConfig } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'

export async function createCheckoutSessionAction() {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id || !session?.user?.stripeSubscriptionId) {
    return {
      data: null,
      title: 'Usuário não autorizado',
      message: 'Usuário não autorizado',
      error: true,
    }
  }

  const checkoutSession = await createCheckoutSession(
    session.user.id as string,
    session.user.email as string,
    session.user.stripeSubscriptionId as string,
  )

  if (!checkoutSession.url) return
  redirect(checkoutSession.url)
}
