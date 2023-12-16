import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href="/">App de Eventos</Link>
        <p>
          {new Date().getFullYear()} App de Eventos. Todos os direitos
          reservados
        </p>
      </div>
    </footer>
  );
}
