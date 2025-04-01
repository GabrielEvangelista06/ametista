export const config = {
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    weebhookSceret: process.env.STRIPE_WEBHOOK_SECRET,
    plans: {
      free: {
        priceId: 'price_1PdyQ5EUJwW5eNQqTtp80JFM',
        quota: {
          TRANSACTIONS: 30,
          BANK_INFOS: 2,
          CARDS: 1,
          CATEGORIES: 5,
        },
      },
      prime: {
        priceId: 'price_1PeO1jEUJwW5eNQqgMOWunkx',
        quota: {
          TRANSACTIONS: Infinity,
          BANK_INFOS: Infinity,
          CARDS: Infinity,
          CATEGORIES: Infinity,
        },
      },
    },
  },
}
