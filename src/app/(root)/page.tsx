import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import Search from '@/components/shared/search';
import Collection from '@/components/shared/collection';
import CategoryFilter from '@/components/shared/category-filter';
import { getAllEvents } from '@/lib/server-actions/event.actions';

export default async function Page({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = searchParams?.query || '';
  const category = searchParams?.category || '';

  const events = await getAllEvents(searchText, category, page);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Hospede, Conecte, Celebre: Seus Eventos, em nossa plataforma!
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Crie eventos totalmente customizáveis de forma simples, rápida e
              intuitiva.
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Explore Agora</Link>
            </Button>
          </div>
          <Image
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>
      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">Pesquise Qualquer Evento</h2>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>
        <Collection
          data={events?.data}
          emptyTitle="Nenhum evento encontrado"
          emptyStateSubtext="Volte mais tarde"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
    </>
  );
}
