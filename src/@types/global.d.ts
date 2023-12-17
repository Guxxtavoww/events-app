import type { ReactNode } from 'react';
import type { EnvType } from '../config/env.config';

declare global {
  export type Maybe<T> = T | null | undefined;

  export type WithChildren<T extends Record<string, any> = {}> = T & {
    children: ReactNode;
  };

  export type SearchParamProps = {
    params: Record<string, string>;
    searchParams: { [key: string]: string | undefined };
  };

  export type UrlQueryParams = {
    params: string;
    key: string;
    value: string | null;
  };

  export type RemoveUrlQueryParams = {
    params: string;
    keysToRemove: string[];
  };

  namespace NodeJS {
    export interface ProcessEnv extends EnvType {}
  }
}
