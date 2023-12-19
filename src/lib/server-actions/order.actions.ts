'use server';
import { redirect } from 'next/navigation';

import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from './types';
import { performDatabaseOperation } from '../database/database.lib';
import Stripe from 'stripe';

export async function getOrderByEvent({
  event_id,
  search_string,
}: GetOrdersByEventParams) {
  if (!event_id) throw new Error('Event ID is required');

  return performDatabaseOperation(async (primsa) => {
    const orders = await primsa.orders.findMany({
      where: {
        event_id,
        buyer: {
          OR: [
            {
              first_name: search_string,
            },
            {
              last_name: search_string,
            },
          ],
        },
      },
      select: {
        buyer: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        created_at: true,
        event: {
          select: {
            event_id: true,
            title: true,
            price: true,
          },
        },
      },
    });

    return orders;
  });
}

export async function getOrdersByUser({
  user_id,
  limit = 3,
  page,
}: GetOrdersByUserParams) {
  return performDatabaseOperation(async (prisma) => {
    const skipAmount = (Number(page) - 1) * limit;

    const [orders, ordersCount] = await Promise.all([
      prisma.orders.findMany({
        where: {
          buyer: {
            user_id,
          },
        },
        take: limit,
        skip: skipAmount,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          order_id: true,
          event: {
            select: {
              event_id: true,
              organizer: {
                select: {
                  first_name: true,
                  user_id: true,
                  last_name: true,
                },
              },
              category: {
                select: {
                  category_id: true,
                  category_name: true,
                },
              },
              created_at: true,
              description: true,
              image_url: true,
              end_date_time: true,
              is_free: true,
              location: true,
              title: true,
              price: true,
              start_date_time: true,
              url: true,
            },
          },
        },
      }),
      prisma.orders.count({
        where: {
          buyer: {
            user_id,
          },
        },
      }),
    ]);

    return {
      data: orders.map((order) => order.event),
      totalPages: Math.ceil(ordersCount / limit),
    };
  });
}

export async function checkoutOrder({
  buyer_id,
  event_id,
  event_title,
  is_free,
  price,
}: CheckoutOrderParams) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const order_price = is_free ? 0 : Number(price) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'brl',
            unit_amount: order_price,
            product_data: {
              name: event_title,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        event_id,
        buyer_id,
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}profile`,
      cancel_url: process.env.NEXT_PUBLIC_SERVER_URL,
    });

    redirect(session.url || '/');
  } catch (error) {
    throw error;
  }
}

export async function createOrder({
  buyer_id,
  created_at,
  event_id,
  stripe_id,
  total_amount,
}: CreateOrderParams) {
  return performDatabaseOperation(async (prisma) => {
    return prisma.orders.create({
      data: {
        stripe_id,
        buyer_id,
        created_at,
        event_id,
        total_amount,
      },
    });
  });
}
