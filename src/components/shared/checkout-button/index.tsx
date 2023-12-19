'use client';

import Link from 'next/link';
import React, { useMemo } from 'react';
import { SignedIn, SignedOut, useAuth } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { getEventById } from '@/lib/server-actions/event.actions';

import Checkout from './components/checkout';

export interface iCheckoutButtonProps {
  event: NonNullable<Awaited<ReturnType<typeof getEventById>>>;
}

export default function CheckoutButton({ event }: iCheckoutButtonProps) {
  const { userId } = useAuth();

  const hasEventFinished = useMemo(
    () => new Date(event.end_date_time) < new Date(),
    [event]
  );

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">Perdão, o evento já foi encerrado.</p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">Comprar ingresso</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Checkout event={event} user_id={userId!} />
          </SignedIn>
        </>
      )}
    </div>
  );
}
