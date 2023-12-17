import { auth } from '@clerk/nextjs';

import EventForm from '@/components/shared/event-form';

export default function Page() {
  const { sessionClaims } = auth();

  const userId = String(sessionClaims?.userId);

  return (
    <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
      <h3 className="wrapper h3-bold text-center sm:text-left">Criar Evento</h3>
      <div className="wrapper my-8">
        <EventForm userId={userId} type="Create" />
      </div>
    </section>
  );
}
