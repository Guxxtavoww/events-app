import { EventFormType } from '@/app/(root)/events/create/components/create-event-from.types';

export interface iCreateUserPayload {
  clerk_id: string;
  email: string;
  username: string;
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

export type CheckoutOrderParams =
  | {
      is_free: true;
      event_title: string;
      event_id: string;
      price?: Maybe<string>;
      buyer_id: string;
    }
  | {
      is_free?: false;
      event_title: string;
      event_id: string;
      price: string;
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
  user_id: string;
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
  event: Partial<EventFormType> & { event_id: string };
  path: string;
};

export type GetRelatedEventsByCategoryParams = {
  category_id: number;
  limit?: number;
  page: number | string;
  event_id: string;
};

export type GetEventsByUserParams = {
  user_id: string;
  limit?: number;
  page: number;
};
