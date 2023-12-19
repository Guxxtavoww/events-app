'use server';

import { revalidatePath } from 'next/cache';

import { performDatabaseOperation } from '../database/database.lib';
import {
  CreateEventParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
  UpdateEventParams,
} from './types';
import { getCategoryByName } from './category.actions';

export async function getAllEvents(
  query: string,
  category: string,
  page = 1,
  limit = 6
) {
  return performDatabaseOperation(async (prisma) => {
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;

    const skipAmount = (Number(page) - 1) * limit;

    const where = {
      OR: [
        {
          category: {
            category_id: categoryCondition?.category_id,
          },
        },
        {
          title: {
            contains: query,
          },
        },
        {
          description: {
            contains: query,
          },
        },
      ],
    };

    const [events, eventsCount] = await Promise.all([
      prisma.events.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
        skip: skipAmount,
        take: limit,
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
      }),
      prisma.events.count({ where }),
    ]);

    return {
      data: events,
      totalPages: Math.ceil(eventsCount / limit),
    };
  });
}

export async function createEvent({ event, path, user_id }: CreateEventParams) {
  return performDatabaseOperation(async (prisma) => {
    const organizer = await prisma.users.findUnique({
      where: {
        user_id,
      },
    });

    if (!organizer) throw new Error('Organizer not found');

    const newEvent = await prisma.events.create({
      data: {
        organizer_id: organizer.user_id,
        category_id: event.category_id,
        description: event.description,
        end_date_time: new Date(event.end_date_time),
        image_url: event.image_url,
        is_free: event.is_free,
        location: event.location,
        price: event.price,
        start_date_time: new Date(event.start_date_time),
        title: event.title,
        url: event.url,
      },
    });

    revalidatePath(path);

    return newEvent;
  });
}

export async function updateEvent({ event, path, user_id }: UpdateEventParams) {
  return performDatabaseOperation(async (prisma) => {
    const eventToUpdate = await prisma.events.findUnique({
      where: {
        event_id: event.event_id,
      },
      select: {
        event_id: true,
        category_id: true,
        organizer: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (!eventToUpdate) {
      throw new Error('Unauthorized or event not found');
    }

    const eventOrganizer = eventToUpdate.organizer;

    if (eventOrganizer.user_id !== user_id) {
      throw new Error('Invalid organizer');
    }

    const updatedEvent = await prisma.events.update({
      where: {
        event_id: eventToUpdate.event_id,
      },
      data: {
        category_id: event.category_id,
        description: event.description,
        end_date_time: event.end_date_time,
        image_url: event.image_url,
        is_free: event.is_free,
        location: event.location,
        price: event.price,
        title: event.title,
        url: event.url,
        start_date_time: event.start_date_time,
      },
    });

    revalidatePath(path);

    return updatedEvent;
  });
}

export async function getEventById(event_id: string) {
  return performDatabaseOperation(async (prisma) => {
    const foundedEvent = await prisma.events.findUnique({
      where: {
        event_id,
      },
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
    });

    return foundedEvent;
  });
}

export async function getEventsByUser({
  page,
  user_id,
  limit = 6,
}: GetEventsByUserParams) {
  return performDatabaseOperation(async (prisma) => {
    const skipAmount = (page - 1) * limit;

    const where = {
      organizer_id: user_id,
    };

    const [events, eventsCount] = await Promise.all([
      prisma.events.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
        skip: skipAmount,
        take: limit,
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
      }),
      prisma.events.count({ where }),
    ]);

    return {
      data: events,
      totalPages: Math.ceil(eventsCount / limit),
    };
  });
}

export async function getRelatedEventsByCategory({
  category_id,
  page = 1,
  limit = 3,
  event_id,
}: GetRelatedEventsByCategoryParams) {
  return performDatabaseOperation(async (primsa) => {
    const skipAmount = (Number(page) - 1) * limit;

    const where = {
      category_id,
      NOT: {
        event_id,
      },
    };

    const [events, eventsCount] = await Promise.all([
      primsa.events.findMany({
        where: {
          category_id,
          NOT: {
            event_id,
          },
        },
        orderBy: {
          created_at: 'desc',
        },
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
        skip: skipAmount,
        take: limit,
      }),
      primsa.events.count({ where }),
    ]);

    return {
      data: events,
      totalPages: Math.ceil(eventsCount / limit),
    };
  });
}

export async function deleteEvent(event_id: string, path?: string) {
  return performDatabaseOperation(async (prisma) => {
    await Promise.all([
      prisma.events.delete({
        where: {
          event_id,
          is_free: true,
        },
      }),
      prisma.orders.deleteMany({
        where: {
          event_id,
        },
      }),
    ]);

    revalidatePath(path || '/');
  });
}
