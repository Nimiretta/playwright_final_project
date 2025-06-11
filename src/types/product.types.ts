import { MANUFACTURERS } from 'data/products';
import { IResponseFields, productSortFields, sortDirection } from 'types/api.types';

export interface IProduct {
  name: string;
  manufacturer: MANUFACTURERS;
  price: number;
  amount: number;
  notes?: string;
}

export interface IProductFromResponse extends IProduct {
  _id: string;
  createdOn: string;
}

export interface IProductResponse extends IResponseFields {
  Product: IProductFromResponse;
}

export interface IProductsResponse extends IResponseFields {
  Products: IProductFromResponse[];
}

export interface IProductResponseSorted extends IProductsResponse {
  sorting: {
    sortField: productSortFields;
    sortOrder: sortDirection;
  };
  page: number;
  limit: number;
  search: string;
  total: number;
  manufacturer: MANUFACTURERS[];
}
