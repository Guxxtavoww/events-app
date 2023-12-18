import React from 'react';
import Link from 'next/link';
import { auth } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import Collection from '@/components/shared/collection';
import { getOrdersByUser } from '@/lib/server-actions/order.actions';
import { getEventsByUser } from '@/lib/server-actions/event.actions';

export default async function Page({ searchParams }: SearchParamProps) {
  const { sessionClaims } = auth();
  const userId = String(sessionClaims?.sub);

  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1;

  const [orderedEvents, organizedEvents] = await Promise.all([
    getOrdersByUser({ clerk_id: userId, page: ordersPage }),
    getEventsByUser({ userId, page: eventsPage }),
  ]);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Meus ingressos</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">Explore mais eventos</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
        <Collection
          data={orderedEvents.data}
          emptyTitle="Você ainda não possui nenhum ingresso."
          emptyStateSubtext="Não se preocupe – muitos eventos emocionantes para explorar!"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orderedEvents?.totalPages}
        />
      </section>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">
            Eventos organizados
          </h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create">Crie um novo evento!</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="Você não criou nenhum evento por enquanto"
          emptyStateSubtext="Vá criar alguns 😉"
          collectionType="Events_Organized"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />
      </section>
    </>
  );
}
