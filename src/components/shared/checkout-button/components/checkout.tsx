'use client';

import React, { useCallback, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';

import { iCheckoutButtonProps } from '..';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import {
  CheckoutOrderParams,
  CreateOrderParams,
} from '@/lib/server-actions/types';
import { checkoutOrder, createOrder } from '@/lib/server-actions/order.actions';

interface iCheckoutProps {
  event: iCheckoutButtonProps['event'];
  user_id: string;
}

loadStripe(process.env.STRIPE_PUBLIC_KEY);

export default function Checkout({ event, user_id }: iCheckoutProps) {
  const { replace } = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['checkout-order', event.event_id],
    mutationFn: (data: CheckoutOrderParams) => checkoutOrder(data),
  });

  const { mutateAsync: createOrderMutation, isPending: isLoading } =
    useMutation({
      mutationKey: ['create-order'],
      mutationFn: (data: CreateOrderParams) => createOrder(data),
    });

  const onCheckout = useCallback(async () => {
    if (event.is_free) {
      const created_order = await createOrderMutation({
        buyer_id: user_id,
        created_at: new Date(),
        event_id: event.event_id,
        total_amount: '1',
      });

      replace(`/orders?eventId=${created_order.event_id}`);
    }

    const order: CheckoutOrderParams = {
      buyer_id: user_id,
      event_id: event.event_id,
      event_title: event.title,
      is_free: false,
      price: event.price!,
    };

    return await mutateAsync(order);
  }, [event, user_id, mutateAsync, replace, createOrderMutation]);

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
        disabled={isPending || isLoading}
      >
        {event.is_free ? 'Adquirir Bilhete' : 'Comprar Bilhete'}
      </Button>
    </form>
  );
}
