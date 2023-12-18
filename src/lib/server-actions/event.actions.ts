'use server';

import { revalidatePath } from 'next/cache';


import { performDatabaseOperation } from '../database/database.lib';
import {
  CreateEventParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
  UpdateEventParams,
} from './types';

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
    const organizer = await User.findOne({ clerk_id: user_id });

    if (!organizer) throw new Error('Organizer not found');

    const eventPayload = {
      ...event,
      category: event.category_id,
      organizer: organizer._id,
    };

    const newEvent = await Event.create(eventPayload);

    revalidatePath(path);

    return newEvent as IEvent;
  });
}

export async function updateEvent({ event, path, user_id }: UpdateEventParams) {
  return performDatabaseOperation(async () => {
    const eventToUpdate = (await Event.findById(event._id)) as
      | IEvent
      | undefined;

    if (!eventToUpdate) {
      throw new Error('Unauthorized or event not found');
    }

    const eventOrganizer = await User.findById(eventToUpdate.organizer._id);

    if (!eventOrganizer || eventOrganizer.clerk_id !== user_id) {
      throw new Error('Invalid organizer');
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
    const event = (await populateEvent(Event.findById(eventId))) as
      | IEvent
      | undefined;

    if (!event) return undefined;

    return JSON.parse(JSON.stringify(event)) as IEvent;
  });
}

export async function getEventsByUser({
  page,
  userId,
  limit = 6,
}: GetEventsByUserParams) {
  return performDatabaseOperation(async () => {
    const skipAmount = (page - 1) * limit;

    const eventsQuery = Event.find()
      .sort({ created_at: 'desc' })
      .skip(skipAmount)
      .limit(limit);

    const [events, eventsCount] = await Promise.all([
      populateEvent(eventsQuery),
      Event.countDocuments(),
    ]);

    return {
      data: JSON.parse(JSON.stringify(events)) as IEvent[],
      totalPages: Math.ceil(eventsCount / limit),
    };
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
