import React from 'react';
import Link from 'next/link';
import { auth } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';

export default async function Page({ searchParams }: SearchParamProps) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1;

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
    </>
  );
}
