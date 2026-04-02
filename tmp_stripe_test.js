import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-03-31.basil' })

async function main() {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: { name: 'test' },
          unit_amount: 100,
        },
        quantity: 1,
      },
    ],
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  })
  console.log('session.id', session.id)
  console.log('session.client_secret', session.client_secret)
  console.log('session', session)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})