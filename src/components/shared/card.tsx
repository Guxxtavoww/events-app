import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';

import { formatPrice } from '@/utils/format-price.util';
import { formatDateTime } from '@/utils/format-date-time.util';

import DeleteEventConfirmation from './delete-event-confirmation';

type CardProps = {
  event: {
    event_id: string;
    title: string;
    description: string;
    location: string;
    created_at: Date | null;
    image_url: string;
    start_date_time: Date;
    end_date_time: Date;
    price: string | null;
    is_free: boolean;
    url: string;
    category: {
      category_id: number;
      category_name: string
    };
    organizer: {
      user_id: string;
      last_name: string;
      first_name: string
    };
  };
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

export default function Card({ event, hasOrderLink, hidePrice }: CardProps) {
  const { userId } = useAuth();

  const isEventCreator = userId === event.organizer.user_id;

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link
        href={`/events/${event.event_id}`}
        style={{ backgroundImage: `url(${event.image_url})` }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />
      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/events/${event.event_id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
          <DeleteEventConfirmation eventId={event.event_id} />
        </div>
      )}
      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60">
              {event.is_free ? 'Grátis' : formatPrice(event.price)}
            </span>
            <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
              {event.category.category_name}
            </p>
          </div>
        )}
        <p className="p-medium-16 p-medium-18 text-grey-500">
          {formatDateTime(event.start_date_time).dateTime}
        </p>
        <Link href={`/events/${event.event_id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
            {event.title}
          </p>
        </Link>
        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-grey-600">
            {event.organizer.first_name} {event.organizer.last_name}
          </p>
          {hasOrderLink && (
            <Link href={`/orders?eventId=${event.event_id}`} className="flex gap-2">
              <p className="text-primary-500">Detalhes do Pedido</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="search"
                width={10}
                height={10}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
