import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getEventById } from '@/lib/server-actions/event.actions';

import UpdateEventForm from './components/update-event-form';

type UpdateEventProps = {
  params: {
    id: string;
  };
};

export default async function UpdateEvent({
  params: { id },
}: UpdateEventProps) {
  const event = await getEventById(id);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Editar Evento
        </h3>
      </section>
      <div className="wrapper my-8">
        {!event ? (
          <div className="p-2">
            <h1>Evento inválido</h1>
            <Button>
              <Link href="/">Voltar</Link>
            </Button>
          </div>
        ) : (
          <UpdateEventForm title={event.title} />
        )}
      </div>
    </>
  );
}
