'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { headerLinks } from '@/constants';
import { cn } from '@/lib/shadcn.lib';

export default function NavItems() {
  const pathname = usePathname();

  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks.map((link, index) => {
        const isActive = pathname === link.route;

        return (
          <li
            key={index}
            className={cn('flex-center p-medium-16 whitespace-nowrap', {
              'text-primary-500': isActive,
            })}
          >
            <Link href={link.route}>{link.label}</Link>
          </li>
        );
      })}
    </ul>
  );
}
