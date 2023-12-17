'use server';

import { revalidatePath } from 'next/cache';

import Event from '../database/models/event.model';
import User from '../database/models/user.model';
import Order from '../database/models/order.model';
import { UpdateUserParams, iCreateUserPayload } from './types';
import { performDatabaseOperation } from '../database/database.lib';

export async function createUser(payload: iCreateUserPayload) {
  return performDatabaseOperation(async () => {
    return await User.create(payload);
  });
}

export async function getUserById(userId: string) {
  return performDatabaseOperation(async () => {
    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');

    return Promise.resolve(user);
  });
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  return performDatabaseOperation(async () => {
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error('User update failed');

    return updatedUser;
  });
}

export async function deleteUser(clerkId: string) {
  return performDatabaseOperation(async () => {
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error('User not found');
    }

    await Promise.all([
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),
      Order.updateMany(
        { _id: { $in: userToDelete.orders } },
        { $unset: { buyer: 1 } }
      ),
    ]);

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath('/');

    return deletedUser || null;
  });
}
