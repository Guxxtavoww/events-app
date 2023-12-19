import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@clerk/nextjs';

import {
  getEventById,
  getRelatedEventsByCategory,
} from '@/lib/server-actions/event.actions';
import { formatPrice } from '@/utils/format-price.util';
import { formatDateTime } from '@/utils/format-date-time.util';
import Collection from '@/components/shared/collection';
import { Button } from '@/components/ui/button';
import CheckoutButton from '@/components/shared/checkout-button';

export default async function EventDetails({
  params: { id },
  searchParams,
}: SearchParamProps) {
  const { userId } = auth();
  const event = await getEventById(id, userId!);

  if (!event) {
    return (
      <div>
        <h1>Evento inválido</h1>
        <Button>
          <Link href="/">Voltar</Link>
        </Button>
      </div>
    );
  }

  const relatedEvents = await getRelatedEventsByCategory({
    category_id: event.category.category_id,
    page: searchParams.page ? +searchParams.page : 1,
    event_id: id,
  });

  const formatedStartDate = formatDateTime(event.start_date_time);
  const formatedEndDate = formatDateTime(event.end_date_time);

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={event.image_url}
            alt="hero image"
            width={1000}
            height={1000}
            className="h-full min-h-[300px] object-cover object-center"
          />
          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold">{event.title}</h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {event.is_free ? 'Grátis' : formatPrice(event.price)}
                  </p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {event.category.category_name}
                  </p>
                </div>
                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  por{' '}
                  <span className="text-primary-500">
                    {event.organizer.first_name} {event.organizer.last_name}
                  </span>
                </p>
              </div>
            </div>
            <CheckoutButton event={event} />
            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={32}
                  height={32}
                />
                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                  <p>
                    {formatedStartDate.dateOnly} - {formatedStartDate.timeOnly}
                  </p>
                  <p>
                    {formatedEndDate.dateOnly} - {formatedEndDate.timeOnly}
                  </p>
                </div>
              </div>
              <div className="p-regular-20 flex items-center gap-3">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">Descrição:</p>
              <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
              <p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">
                {event.url}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Eventos Parecidos</h2>
        <Collection
          data={relatedEvents?.data}
          emptyTitle="Nenhum evento encontrado"
          emptyStateSubtext="Volte mais tarde"
          collectionType="All_Events"
          limit={3}
          page={searchParams.page || '1'}
          totalPages={relatedEvents?.totalPages}
        />
      </section>
    </>
  );
}
