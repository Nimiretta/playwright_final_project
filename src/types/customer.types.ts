import { COUNTRIES } from 'data/customers';
import { CustomersSortField, IResponseFields, SortDirection } from 'types';

export interface ICustomer {
  email: string;
  name: string;
  country: COUNTRIES;
  city: string;
  street: string;
  house: number;
  flat: number;
  phone: string;
  notes?: string;
}

export interface ICustomerFromResponse extends ICustomer {
  _id: string;
  createdOn: string;
}

export interface ICustomerResponse extends IResponseFields {
  Customer: ICustomerFromResponse;
}

export interface ICustomersResponse extends IResponseFields {
  Customers: ICustomerFromResponse[];
}

export interface ICustomersResponseSorted extends ICustomersResponse {
  sorting: {
    sortField: CustomersSortField;
    sortOrder: SortDirection;
  };
  country: COUNTRIES[];
  limit: number;
  page: number;
  search: string;
  total: number;
}
