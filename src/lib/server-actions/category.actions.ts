'use server';

import { performDatabaseOperation } from '../database/database.lib';
import Category, { ICategory } from '../database/models/category.model';

export async function getAllCategories() {
  return performDatabaseOperation(async () => {
    const categories = await Category.find();

    return categories as ICategory[];
  });
}

export async function createCategory(categoryName: string) {
  return performDatabaseOperation(async () => {
    const newCategory = await Category.create({ name: categoryName });

    return newCategory as ICategory;
  });
}
