'use client';

import { useEffect, useState, useTransition } from 'react';

import { ICategory } from '@/lib/database/models/category.model';
import { getAllCategories } from '@/lib/server-actions/category.actions';

export function useCategories() {
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    startTransition(async () => {
      const categoriesResponse = await getAllCategories();

      setCategories(categoriesResponse);
    });
  }, [startTransition]);

  return {
    isLoading: isPending,
    categories,
    setCategories,
  };
}
