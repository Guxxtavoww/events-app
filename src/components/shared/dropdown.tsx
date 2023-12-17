import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useCategories } from '@/hooks/useCategories.hook';
import { createCategory } from '@/lib/server-actions/category.actions';
import { removeDuplicatedItemsFromArray } from '@/utils/remove-duplicated-items-from-array.util';

import { Input } from '../ui/input';

type DropdownProps = {
  value?: string;
  onChangeHandler?: () => void;
};

function Dropdown({ value, onChangeHandler }: DropdownProps) {
  const [newCategory, setNewCategory] = useState<string>('');

  const { categories, isLoading, setCategories } = useCategories();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['create-category'],
    mutationFn: (categoryName: string) => createCategory(categoryName),
    onSuccess: (category) => {
      setCategories((prev) =>
        removeDuplicatedItemsFromArray([...prev, category], '_id')
      );
    },
  });

  return (
    <Select
      onValueChange={onChangeHandler}
      defaultValue={value}
      disabled={isLoading || isPending}
    >
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Categoria" />
      </SelectTrigger>
      <SelectContent>
        {categories?.map((category) => (
          <SelectItem
            key={category._id}
            value={category._id}
            className="select-item p-regular-14"
          >
            {category.name}
          </SelectItem>
        ))}
        <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
            Adicionar nova Categoria
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>New Category</AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  type="text"
                  placeholder="Nome da categoria"
                  className="input-field mt-3"
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => mutateAsync(newCategory)}>
                Adicionar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
}

export default Dropdown;
