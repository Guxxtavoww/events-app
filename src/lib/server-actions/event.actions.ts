'use server';

import { revalidatePath } from 'next/cache';

import Event, { IEvent } from '@/lib/database/models/event.model';
import User from '@/lib/database/models/user.model';
import Category, { ICategory } from '@/lib/database/models/category.model';
import { handleError } from '@/utils/error-handler.util';

import { performDatabaseOperation } from '../database/database.lib';
import { CreateEventParams, UpdateEventParams } from './types';

const getCategoryByName = async (name: string) => {
  return Category.findOne({
    name: { $regex: name, $options: 'i' },
  }) as unknown as Maybe<ICategory>;
};

const populateEvent = (query: any) => {
  return query
    .populate({
      path: 'organizer',
      model: User,
      select: '_id firstName lastName',
    })
    .populate({ path: 'category', model: Category, select: '_id name' });
};

export async function createEvent({ event, path, user_id }: CreateEventParams) {
  return performDatabaseOperation(async () => {
    const organizer = await User.findById(user_id);

    if (!organizer) throw new Error('Organizer not found');

    const newEvent = await Event.create({
      ...event,
      category: event.category_id,
      organizer: user_id,
    });

    revalidatePath(path);

    return newEvent as IEvent;
  });
}

export async function updateEvent({ event, path, user_id }: UpdateEventParams) {
  return performDatabaseOperation(async () => {
    const eventToUpdate = await Event.findById(event._id);

    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== user_id) {
      throw new Error('Unauthorized or event not found');
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.category_id },
      { new: true }
    );

    revalidatePath(path);

    return updatedEvent as IEvent;
  });
}
