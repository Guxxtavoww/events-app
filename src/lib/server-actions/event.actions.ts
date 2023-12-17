'use server';

import { revalidatePath } from 'next/cache';

import Event, { IEvent } from '@/lib/database/models/event.model';
import User from '@/lib/database/models/user.model';
import Category, { ICategory } from '@/lib/database/models/category.model';
import { handleError } from '@/utils/error-handler.util';

import { performDatabaseOperation } from '../database/database.lib';
import {
  CreateEventParams,
  GetRelatedEventsByCategoryParams,
  UpdateEventParams,
} from './types';

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

export async function getAllEvents(
  query: string,
  category: string,
  page = 1,
  limit = 6
) {
  return performDatabaseOperation(async () => {
    const titleCondition = query
      ? { title: { $regex: query, $options: 'i' } }
      : {};

    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;

    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
      ],
    };

    const skipAmount = (Number(page) - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ created_at: 'desc' })
      .skip(skipAmount)
      .limit(limit);

    const [events, eventsCount] = await Promise.all([
      populateEvent(eventsQuery),
      Event.countDocuments(conditions),
    ]);

    return {
      data: JSON.parse(JSON.stringify(events)) as IEvent[],
      totalPages: Math.ceil(eventsCount / limit),
    };
  });
}

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

export async function getEventById(eventId: string) {
  return performDatabaseOperation(async () => {
    const event = await populateEvent(Event.findById(eventId));

    if (!event) throw new Error('Event not found');

    return event as IEvent;
  });
}

export async function getRelatedEventsByCategory({
  category_id,
  event_id,
  page = 1,
  limit = 3,
}: GetRelatedEventsByCategoryParams) {
  return performDatabaseOperation(async () => {
    const skipAmount = (Number(page) - 1) * limit;

    const conditions = {
      $and: [{ category: category_id }, { _id: { $ne: event_id } }],
    };

    const eventsQuery = Event.find(conditions)
      .sort({ created_at: 'desc' })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: events,
      totalPages: Math.ceil(eventsCount / limit),
    };
  });
}

export async function deleteEvent(eventId: string, path?: string) {
  return performDatabaseOperation(async () => {
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (deletedEvent) revalidatePath(path || '/');

    return deletedEvent;
  });
}