'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';

import { ICategory } from '@/lib/database/models/category.model';
import { getAllCategories } from '@/lib/server-actions/category.actions';
import { removeDuplicatedItemsFromArray } from '@/utils/remove-duplicated-items-from-array.util';

export function useCategories() {
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<ICategory[]>([]);

  const handleAddCategory = useCallback((category: ICategory) => {
    setCategories(prev => removeDuplicatedItemsFromArray([...prev, category], '_id'))
  }, [setCategories])

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
