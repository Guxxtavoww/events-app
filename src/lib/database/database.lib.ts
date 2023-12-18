import { PrismaClient } from '@prisma/client';

import { handleError } from '@/utils/error-handler.util';

class PrimsaInstance {
  private prismaInstance: Maybe<PrismaClient> = null;

  constructor() {
    this.prismaInstance = new PrismaClient();
  }

  async getPrismaInstance() {
    if (this.prismaInstance) {
      await this.prismaInstance.$connect();

      return this.prismaInstance;
    }

    throw new Error('Prisma instance not initialized.');
  }

  async disconnect() {
    if (this.prismaInstance) {
      await this.prismaInstance.$disconnect();
    }
  }
}

const prismaInstance = new PrimsaInstance();

export async function performDatabaseOperation<T>(
  callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    const prisma = await prismaInstance.getPrismaInstance();

    const result = await callback(prisma);

    return Promise.resolve(result);
  } catch (error) {
    prismaInstance.disconnect();
    throw handleError(error);
  }
}
