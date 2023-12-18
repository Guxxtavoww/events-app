import { EventFormType } from '@/app/(root)/events/create/components/create-event-from.types';

export interface iCreateUserPayload {
  clerk_id: string;
  email: string;
  username: string | null;
  first_name: string;
  last_name: string;
  photo_url: string;
}

export type UpdateUserParams = {
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
};

export type CheckoutOrderParams = {
  event_title: string;
  event_id: string;
  price: string;
  is_free: boolean;
  buyer_id: string;
};

export type CreateOrderParams = {
  stripe_id: string;
  event_id: string;
  buyer_id: string;
  total_amount: string;
  created_at: Date;
};

export type GetOrdersByEventParams = {
  event_id: string;
  search_string: string;
};

export type GetOrdersByUserParams = {
  user_id: string | null;
  limit?: number;
  page: string | number | null;
};

export type CreateEventParams = {
  user_id: string;
  event: EventFormType;
  path: string;
};

export type UpdateEventParams = {
  user_id: string;
  event: Partial<EventFormType> & { _id: string };
  path: string;
};

export type GetRelatedEventsByCategoryParams = {
  category_id: string;
  event_id: string;
  limit?: number;
  page: number | string;
};

export type GetEventsByUserParams = {
  userId: string;
  limit?: number;
  page: number;
};
