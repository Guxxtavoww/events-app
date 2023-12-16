import type { ReactNode } from 'react';
import type { EnvType } from '../config/env.config';

declare global {
  export type Maybe<T> = T | null | undefined;

  export type WithChildren<T extends Record<string, any> = {}> = T & {
    children: ReactNode;
  };

  export type SearchParamProps = {
    params: Record<string, string>;
    searchParams: { [key: string]: string | string[] | undefined };
  };

  namespace NodeJS {
    export interface ProcessEnv extends EnvType {}
  }
}
