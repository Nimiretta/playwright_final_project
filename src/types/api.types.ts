export interface IRequestOptions {
  baseURL: string;
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  data?: object;
  headers?: Record<string, string>;
}

export interface IResponse<T extends object | null> {
  status: number;
  headers: Record<string, string>;
  body: T;
}

export interface IResponseFields {
  IsSuccess: boolean;
  ErrorMessage: string | null;
}

export type SortDirection = 'asc' | 'desc';

export type CustomersSortField = 'createdOn' | 'email' | 'name' | 'country';

export type ProductSortFields = 'createdOn' | 'name' | 'manufacturer' | 'price';

export type OrderSortFields = 'createdOn' | '_id' | 'email' | 'price' | 'delivery' | 'status' | 'assignedManager';
