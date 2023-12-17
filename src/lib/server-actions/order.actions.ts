'use server';

import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';

import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from './types';
import Order from '../database/models/order.model';
import Event from '../database/models/event.model';
import User from '../database/models/user.model';
import { performDatabaseOperation } from '../database/database.lib';

export async function getOrderByEvent({
  event_id,
  search_string,
}: GetOrdersByEventParams) {
  if (!event_id) throw new Error('Event ID is required');

  return performDatabaseOperation(async () => {
    const eventObjectId = new ObjectId(event_id);

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyer',
        },
      },
      {
        $unwind: '$buyer',
      },
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'event',
        },
      },
      {
        $unwind: '$event',
      },
      {
        $project: {
          _id: 1,
          total_amount: 1,
          created_at: 1,
          event_title: '$event.title',
          event_id: '$event._id',
          buyer: {
            $concat: ['$buyer.first_name', ' ', '$buyer.last_name'],
          },
        },
      },
      {
        $match: {
          $and: [
            { eventId: eventObjectId },
            { buyer: { $regex: RegExp(search_string, 'i') } },
          ],
        },
      },
    ]);

    return orders;
  });
}
