// eslint-disable-next-line @typescript-eslint/no-unused-vars
import 'next-auth'

declare module 'next-auth' {
  interface User {
    username: string | null
    stripeSubscriptionId?: string | null
  }
  interface Session {
    user: User & {
      username: string
      stripeSubscriptionId?: string | null
    }
    token: {
      username: string
      stripeSubscriptionId?: string | null
    }
  }
}
