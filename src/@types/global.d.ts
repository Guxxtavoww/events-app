import type { ReactNode } from 'react';

declare global {
  export type Maybe<T> = T | null | undefined;

  export type WithChildren<T extends Record<string, any> = {}> = T & {
    children: ReactNode;
  };

  //   namespace NodeJS {
  //     export interface ProcessEnv extends EnvType {}
  //   }
}
