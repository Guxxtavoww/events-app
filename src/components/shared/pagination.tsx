'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { formUrlQuery } from '@/utils/url.utils';

import { Button } from '../ui/button';

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

export default function Pagination({
  page,
  totalPages,
  urlParamName,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1}
      >
        Anterior
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
      >
        Próximo
      </Button>
    </div>
  );
}
