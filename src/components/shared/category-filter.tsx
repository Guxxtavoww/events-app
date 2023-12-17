'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories.hook';
import { formUrlQuery, removeKeysFromQuery } from '@/utils/url.utils';

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { categories, isLoading } = useCategories();

  const onSelectCategory = useCallback(
    (category: string) => {
      let newUrl = '';

      if (category && category !== 'All') {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'category',
          value: category,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['category'],
        });
      }

      router.push(newUrl, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <Select
      onValueChange={(value: string) => onSelectCategory(value)}
      disabled={isLoading}
    >
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Categoria" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All" className="select-item p-regular-14">
          Todas
        </SelectItem>
        {categories?.map((category) => (
          <SelectItem
            value={category.name}
            key={category._id}
            className="select-item p-regular-14"
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
