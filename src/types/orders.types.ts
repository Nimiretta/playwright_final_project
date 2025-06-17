import { ORDER_STATUSES } from 'data/orders/statuses.data';
import { ICustomerFromResponse } from './customer.types';
import { IProductFromResponse } from './product.types';
import { IResponseFields, OrderSortFields, SortDirection } from './api.types';
import { ROLES } from 'data/roles.data';
import { COUNTRIES } from 'data/customers/countries.data';
import { DELIVERY_CONDITIONS } from 'data/orders/delivery.data';
import { ORDER_HISTORY_ACTIONS } from 'data/orders/historyActions.data';
import { IUser } from './signIn.types';

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
  delivery: IDelivery | null;
  comments: IOrderComment[];
  history: IOrderHistoryItem[];
  assignedManager: IAssignedManager | null;
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
export interface IDelivery {
  finalDate: string;
  condition: DELIVERY_CONDITIONS;
  address: IAddress;
}

export interface IAddress {
  country: COUNTRIES;
  city: string;
  street: string;
  house: number;
  flat: number;
}

export interface IOrderComment {
  createdOn: string;
  text: string;
  _id: string;
}

export interface IOrderHistoryItem {
  status: ORDER_STATUSES;
  customer: string;
  products: IProductFromResponse[];
  total_price: number;
  delivery: IDelivery | null;
  changedOn: string;
  action: ORDER_HISTORY_ACTIONS;
  performer: IUser;
}
