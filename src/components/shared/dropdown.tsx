import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { useCategories } from '@/hooks/useCategories.hook';
import { createCategory } from '@/lib/server-actions/category.actions';

import { Input } from '../ui/input';

type DropdownProps = {
  value?: string;
  onChangeHandler?: (value: string) => void;
};

function Dropdown({ value, onChangeHandler }: DropdownProps) {
  const [newCategory, setNewCategory] = useState<string>('');

  const { categories, isLoading, handleAddCategory } = useCategories();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['create-category'],
    mutationFn: (categoryName: string) => createCategory(categoryName),
    onSuccess: (category) => handleAddCategory(category),
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
            key={category.category_id}
            value={category.category_id?.toString()}
            className="select-item p-regular-14"
          >
            {category.category_name}
          </SelectItem>
        ))}
        <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
            Adicionar nova Categoria
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Nova Categoria</AlertDialogTitle>
              <Input
                type="text"
                placeholder="Nome da categoria"
                className="input-field mt-3"
                onChange={(e) => setNewCategory(e.target.value)}
                disabled={isPending}
              />
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
