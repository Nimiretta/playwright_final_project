import { ORDER_STATUSES } from 'data/orders/statuses.data';
import { ICustomerFromResponse } from './customer.types';
import { IProductFromResponse } from './product.types';
import { IResponseFields, OrderSortFields, SortDirection } from './api.types';
import { ROLES } from 'data/roles.data';

export interface IOrderRequest {
  customer: string;
  products: string[];
}

export interface IOrder {
  status: ORDER_STATUSES;
  customer: ICustomerFromResponse;
  products: IProductFromResponse[];
  createdOn: string;
  total_price: number;
  delivery: null;
  comments: string[];
  history: object[];
  assignedManager: IAssignedManager;
}

export interface IOrderFromResponse extends IOrder {
  _id: string;
}

export interface IOrderResponse extends IResponseFields {
  Order: IOrderFromResponse;
}

export interface IOrdersResponse extends IResponseFields {
  Orders: IOrderFromResponse[];
}

export interface IOrderResponseSorted extends IOrdersResponse {
  sorting: {
    sortField: OrderSortFields;
    sortOrder: SortDirection;
  };
  page: number;
  limit: number;
  search: string;
  total: number;
  status: ORDER_STATUSES[];
}

export interface IAssignedManager {
  createdOn: string;
  firstName: string;
  lastName: string;
  roles: ROLES[];
  username: string;
  _id: string;
}
// export interface IProductsResponse extends IResponseFields {
//   Products: IProductFromResponse[];
// }

// export interface IProductResponseSorted extends IProductsResponse {
//   sorting: {
//     sortField: ProductSortFields;
//     sortOrder: SortDirection;
//   };
//   page: number;
//   limit: number;
//   search: string;
//   total: number;
//   manufacturer: MANUFACTURERS[];
// }
