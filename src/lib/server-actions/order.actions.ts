'use server';
import { redirect } from 'next/navigation';

import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from './types';
import { performDatabaseOperation } from '../database/database.lib';

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
    });

    return orders;
  });
}

export async function getOrdersByUser({
  clerk_id,
  limit = 3,
  page,
}: GetOrdersByUserParams) {
  return performDatabaseOperation(async (prisma) => {
    const skipAmount = (Number(page) - 1) * limit;

    const [orders, ordersCount] = await Promise.all([
      prisma.orders.findMany({
        where: {
          buyer: {
            clerk_id,
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
              organizer: {
                select: {
                  first_name: true,
                  user_id: true,
                  last_name: true,
                },
              },
            },
          },
        },
      }),
      prisma.orders.count({
        where: {
          buyer: {
            clerk_id,
          },
        },
      }),
    ]);

    return {
      data: orders?.map((order) => order.event),
      totalPages: Math.ceil(ordersCount / limit),
    };
  });
}
