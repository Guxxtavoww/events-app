'use client';

import { useTransition } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteEvent } from '@/lib/server-actions/event.actions';

export default function DeleteEventConfirmation({
  eventId,
}: {
  eventId: string;
}) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Image
          src="/assets/icons/delete.svg"
          alt="edit"
          width={20}
          height={20}
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza de que deseja excluir?
          </AlertDialogTitle>
          <AlertDialogDescription className="p-regular-16 text-grey-600">
            Isso excluirá permanentemente este evento
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                await deleteEvent(eventId, pathname);
              })
            }
          >
            {isPending ? 'Deletando...' : 'Deletar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
