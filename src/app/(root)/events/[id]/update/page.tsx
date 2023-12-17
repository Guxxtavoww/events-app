import { auth } from '@clerk/nextjs';

import EventForm from '@/components/shared/event-form';
import { getEventById } from '@/lib/server-actions/event.actions';

type UpdateEventProps = {
  params: {
    id: string;
  };
};

export default async function UpdateEvent({
  params: { id },
}: UpdateEventProps) {
  const { sessionClaims } = auth();

  const userId = String(sessionClaims?.userId);

  const event = await getEventById(id);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Editar Evento
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm
          type="Update"
          event={event}
          eventId={event._id}
          userId={userId}
        />
      </div>
    </>
  );
}
