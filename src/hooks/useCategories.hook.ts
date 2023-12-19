'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';

import { toast } from '@/components/ui/use-toast';
import { getAllCategories } from '@/lib/server-actions/category.actions';
import { removeDuplicatedItemsFromArray } from '@/utils/remove-duplicated-items-from-array.util';

export function useCategories() {
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<
    { category_id: number; category_name: string }[]
  >([]);

  const handleAddCategory = useCallback(
    (category: (typeof categories)[number] | undefined) => {
      if (!category) {
        toast({
          title: 'Categoria já existe',
          variant: 'destructive',
        });

        return;
      }

      setCategories((prev) =>
        removeDuplicatedItemsFromArray([...prev, category], 'category_name')
      );
    },
    [setCategories]
  );

  useEffect(() => {
    startTransition(async () => {
      const categoriesResponse = await getAllCategories();

      setCategories(categoriesResponse);
    });
  }, [startTransition]);

  return {
    isLoading: isPending,
    categories,
    handleAddCategory,
  };
}
