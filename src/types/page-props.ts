// src/types/page-props.ts

/**
 * Props for Server Components.
 * `params` is a direct object.
 */
export type ServerPageProps<
  TParams = Record<string, string | undefined>,
  TSearchParams = Record<string, string | string[] | undefined>
> = {
  params: TParams;
  searchParams?: TSearchParams;
};

/**
 * Props for Client Components that use `React.use(params)`.
 * `params` is a Promise.
 * `searchParams` is a direct object.
 */
export type ClientPageProps<
  TParams = Record<string, string | undefined>,
  TSearchParams = Record<string, string | string[] | undefined>
> = {
  params: Promise<TParams>;
  searchParams?: TSearchParams;
};
