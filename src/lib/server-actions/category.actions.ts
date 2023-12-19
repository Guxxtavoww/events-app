'use server';

import { performDatabaseOperation } from '../database/database.lib';

export async function getAllCategories() {
  return performDatabaseOperation(async (prisma) => {
    const categories = await prisma.categories.findMany();

    return categories;
  });
}

export async function getCategoryByName(category_name: string) {
  return performDatabaseOperation(async (prisma) => {
    try {
      return prisma.categories.findFirst({
        where: {
          category_name,
        },
      });
    } catch (error) {
      return undefined;
    }
  });
}

export async function createCategory(categoryName: string) {
  return performDatabaseOperation(async (prisma) => {
    const existingCategory = await getCategoryByName(categoryName);

    if (existingCategory) return undefined;

    const newCategory = await prisma.categories.create({
      data: {
        category_name: categoryName,
      },
    });

    return newCategory;
  });
}
