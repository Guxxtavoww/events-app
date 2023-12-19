import stripe from 'stripe';
import { NextResponse } from 'next/server';

import { createOrder } from '@/lib/server-actions/order.actions';

export async function POST(request: Request) {
  const body = await request.text();

  const sig = String(request.headers.get('stripe-signature'));
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json({ message: 'Webhook error', error: err });
  }

  const eventType = event.type;

  if (eventType === 'checkout.session.completed') {
    const { id, amount_total, metadata } = event.data.object;

    const newOrder = await createOrder({
      stripe_id: id,
      event_id: metadata?.event_id || '',
      buyer_id: metadata?.buyer_id || '',
      total_amount: amount_total ? (amount_total / 100).toString() : '0',
      created_at: new Date(),
    });

    return NextResponse.json({ message: 'OK', order: newOrder });
  }

  return new Response('', { status: 200 });
}
