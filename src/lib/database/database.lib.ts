import mongoose from 'mongoose';

import { handleError } from '@/utils/error-handler.util';

const mongodb_uri = process.env.MONGODB_URI;

let cashed: typeof mongoose & { conn?: Maybe<unknown>; promise?: Maybe<any> } =
  mongoose || {
    conn: null,
    promise: null,
  };

export async function connectToDatabase() {
  if (cashed.conn) return cashed.conn;

  cashed.promise =
    cashed.promise ||
    mongoose.connect(mongodb_uri, {
      dbName: 'event-app',
      bufferCommands: false,
    });

  cashed.conn = await cashed.promise;

  return cashed.conn;
}

export async function performDatabaseOperation<T>(
  callback: (...args: any) => Promise<T>
) {
  try {
    await connectToDatabase();

    const result = await callback();

    return Promise.resolve(result);
  } catch (error) {
    throw handleError(error);
  }
}
