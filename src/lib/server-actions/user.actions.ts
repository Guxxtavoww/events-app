'use server';

import { revalidatePath } from 'next/cache';

import { UpdateUserParams, iCreateUserPayload } from './types';
import { performDatabaseOperation } from '../database/database.lib';

export async function createUser({
  clerk_id,
  email,
  first_name,
  last_name,
  photo_url,
  username,
}: iCreateUserPayload) {
  return performDatabaseOperation(async (prisma) => {
    const createdUser = await prisma.users.create({
      data: {
        user_id: clerk_id,
        email,
        first_name,
        last_name,
        photo_url,
        username,
      },
    });

    return createdUser;
  });
}

export async function getUserById(user_id: string) {
  return performDatabaseOperation(async (prisma) => {
    const user = await prisma.users.findUnique({
      where: {
        user_id,
      },
    });

    if (!user) throw new Error('User not found');

    return Promise.resolve(user);
  });
}

export async function updateUser(
  clerk_id: string,
  { first_name, last_name, photo_url, username }: UpdateUserParams
) {
  return performDatabaseOperation(async (prisma) => {
    const updatedUser = await prisma.users.update({
      where: {
        user_id: clerk_id,
      },
      data: {
        first_name,
        last_name,
        photo_url,
        username,
      },
    });

    if (!updatedUser) throw new Error('User update failed');

    return updatedUser;
  });
}

export async function deleteUser(clerk_id: string) {
  return performDatabaseOperation(async (primsa) => {
    const userToDelete = await primsa.users.findUnique({
      where: {
        user_id: clerk_id,
      },
      select: {
        user_id: true,
      },
    });

    if (!userToDelete) {
      throw new Error('User not found');
    }

    await Promise.all([
      primsa.events.deleteMany({
        where: { organizer_id: userToDelete.user_id },
      }),
      primsa.orders.deleteMany({ where: { buyer_id: userToDelete.user_id } }),
    ]);

    const deletedUser = await primsa.users.delete({
      where: {
        user_id: userToDelete.user_id,
      },
    });

    revalidatePath('/');

    return deletedUser;
  });
}
