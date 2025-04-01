import Stripe from 'stripe'

import { db } from '../prisma'
import { config } from './../../config'

export const stripe = new Stripe(config.stripe.secretKey || '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

export const getStripeCustomerByEmail = async (email: string) => {
  const customers = await stripe.customers.list({ email })
  return customers.data[0]
}

export const createStripeCustomer = async (input: {
  name?: string
  email: string
}) => {
  const customer = await getStripeCustomerByEmail(input.email)
  if (customer) return customer

  const createdCustomer = await stripe.customers.create({
    email: input.email,
    name: input.name,
  })

  const createdCustomerSubscription = await stripe.subscriptions.create({
    customer: createdCustomer.id,
    items: [{ price: config.stripe.plans.free.priceId }],
  })

  await db.user.update({
    where: {
      email: input.email,
    },
    data: {
      stripeCustomerId: createdCustomer.id,
      stripeSubscriptionId: createdCustomerSubscription.id,
      stripeSubscriptionStatus: createdCustomerSubscription.status,
      stripePriceId: config.stripe.plans.free.priceId,
    },
  })

  return createdCustomer
}

export const createCheckoutSession = async (
  userId: string,
  userEmail: string,
  userStripeSubscriptionId: string,
) => {
  try {
    const customer = await createStripeCustomer({
      email: userEmail,
    })

    if (!userStripeSubscriptionId) {
      throw new Error('userStripeSubscriptionId é nulo ou undefined')
    }

    const subscription = await stripe.subscriptionItems.list({
      subscription: userStripeSubscriptionId,
      limit: 1,
    })

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: 'http://localhost:3000/app/settings/subscription',
      flow_data: {
        type: 'subscription_update_confirm',
        after_completion: {
          type: 'redirect',
          redirect: {
            return_url:
              'http://localhost:3000/app/settings/subscription?success=true',
          },
        },
        subscription_update_confirm: {
          subscription: userStripeSubscriptionId,
          items: [
            {
              id: subscription.data[0].id,
              price: config.stripe.plans.prime.priceId,
              quantity: 1,
            },
          ],
        },
      },
    })

    return {
      url: session.url,
    }
  } catch (error) {
    console.error(error)
    throw new Error('Error to create checkout session')
  }
}

export const handleProcessWebhookCheckout = async (event: {
  object: Stripe.Checkout.Session
}) => {
  const clientReferenceId = event.object.client_reference_id as string
  const stripeSubscriptionId = event.object.subscription as string
  const stripeCustomerId = event.object.customer as string
  const checkoutStatus = event.object.status

  if (checkoutStatus !== 'complete') return

  if (!clientReferenceId || !stripeSubscriptionId || !stripeCustomerId) {
    throw new Error(
      'clientReferenceId, stripeSubscriptionId and stripeCustomerId is required',
    )
  }

  const userExists = await db.user.findUnique({
    where: {
      id: clientReferenceId,
    },
    select: {
      id: true,
    },
  })

  if (!userExists) {
    throw new Error('user of clientReferenceId not found')
  }

  await db.user.update({
    where: {
      id: userExists.id,
    },
    data: {
      stripeCustomerId,
      stripeSubscriptionId,
    },
  })
}

export const handleProcessWebhookUpdatedSubscription = async (event: {
  object: Stripe.Subscription
}) => {
  const stripeCustomerId = event.object.customer as string
  const stripeSubscriptionId = event.object.id as string
  const stripeSubscriptionStatus = event.object.status
  const stripePriceId = event.object.items.data[0].price.id

  const userExists = await db.user.findFirst({
    where: {
      OR: [
        {
          stripeSubscriptionId,
        },
        {
          stripeCustomerId,
        },
      ],
    },
    select: {
      id: true,
    },
  })

  if (!userExists) {
    throw new Error('user of stripeCustomerId not found')
  }

  await db.user.update({
    where: {
      id: userExists.id,
    },
    data: {
      stripeCustomerId,
      stripeSubscriptionId,
      stripeSubscriptionStatus,
      stripePriceId,
    },
  })
}

type Plan = {
  priceId: string
  quota: {
    TRANSACTIONS: number
    BANK_INFOS: number
    CARDS: number
    CATEGORIES: number
  }
}

type Plans = {
  [key: string]: Plan
}

export const getPlanByPrice = (priceId: string) => {
  const plans: Plans = config.stripe.plans

  const planKey = Object.keys(plans).find(
    (key) => plans[key].priceId === priceId,
  ) as keyof Plans | undefined

  const plan = planKey ? plans[planKey] : null

  if (!plan) {
    throw new Error(`Não foi encontrado um plano para o priceId: ${priceId}`)
  }

  return {
    name: planKey,
    quota: plan.quota,
  }
}

export const getUserCurrentPlan = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { stripePriceId: true },
  })

  if (!user || !user.stripePriceId) {
    throw new Error('Usuário ou o stripePriceId do usuário não encontrado')
  }

  const plan = getPlanByPrice(user.stripePriceId)

  const [transactionsCount, bankInfosCount, cardsCount, categoriesCount] =
    await Promise.all([
      db.transaction.count({ where: { userId } }),
      db.bankInfo.count({ where: { userId } }),
      db.card.count({ where: { userId } }),
      db.category.count({ where: { userId } }),
    ])

  const quotaUsage = (current: number, available: number) => ({
    available,
    current,
    usage: (current / available) * 100,
  })

  return {
    name: plan.name,
    quota: {
      TRANSACTIONS: quotaUsage(transactionsCount, plan.quota.TRANSACTIONS),
      BANK_INFOS: quotaUsage(bankInfosCount, plan.quota.BANK_INFOS),
      CARDS: quotaUsage(cardsCount, plan.quota.CARDS),
      CATEGORIES: quotaUsage(categoriesCount, plan.quota.CATEGORIES),
    },
  }
}
