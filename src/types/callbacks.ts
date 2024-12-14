export type Callback<TParams extends readonly unknown[], TReturn> = <
  T extends TParams,
>(
  ...params: T
) => TReturn;

export type AsyncCallback<TParams extends readonly unknown[], TReturn> = <
  T extends TParams,
>(
  ...params: T
) => Promise<TReturn>;
