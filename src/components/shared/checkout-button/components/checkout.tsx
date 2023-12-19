'use client';

import React, { useCallback, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import { iCheckoutButtonProps } from '..';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { checkoutOrder } from '@/lib/server-actions/order.actions';
import { CheckoutOrderParams } from '@/lib/server-actions/types';

interface iCheckoutProps {
  event: iCheckoutButtonProps['event'];
  user_id: string;
}

loadStripe(process.env.STRIPE_PUBLIC_KEY);

export default function Checkout({ event, user_id }: iCheckoutProps) {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['checkout-order', event.event_id],
    mutationFn: (data: CheckoutOrderParams) => checkoutOrder(data),
  });

  const onCheckout = useCallback(async () => {
    const order: CheckoutOrderParams =
      event.is_free === true
        ? {
            buyer_id: user_id,
            event_id: event.event_id,
            event_title: event.title,
            is_free: true,
            price: null,
          }
        : {
            buyer_id: user_id,
            event_id: event.event_id,
            event_title: event.title,
            is_free: false,
            price: event.price!,
          };

    return await mutateAsync(order);
  }, [event, user_id, mutateAsync]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      toast({
        title: 'Encomenda realizada! Você receberá um email de confirmação.',
      });
    }

    if (query.get('canceled')) {
      toast({
        title:
          'Pedido cancelado – continue comprando e finalizando a compra quando estiver pronto.',
      });
    }
  }, []);

  return (
    <form action={onCheckout} method="post">
      <Button
        type="submit"
        role="link"
        size="lg"
        className="button sm:w-fit"
        disabled={isPending}
      >
        {event.is_free ? 'Adquirir Bilhete' : 'Comprar Bilhete'}
      </Button>
    </form>
  );
}
