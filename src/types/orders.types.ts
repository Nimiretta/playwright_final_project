import { ICustomerFromResponse } from './customer.types';
import { IProductInOrder } from './product.types';
import { IPagination, IResponseFields, ISorting, OrderSortFields } from './api.types';
import { COUNTRIES } from 'data/customers/countries.data';
import { IUser } from './signIn.types';
import { DELIVERY_CONDITIONS, ORDER_HISTORY_ACTIONS, ORDER_STATUSES } from 'data/orders';

export interface IOrderRequest {
  customer: string;
  products: string[];
}

export interface IOrderFromResponse {
  status: ORDER_STATUSES;
  customer: ICustomerFromResponse;
  products: IProductInOrder[];
  createdOn: string;
  total_price: number;
  delivery: IDelivery | null;
  comments: IOrderCommentResponse[];
  history: IOrderHistoryItem[];
  assignedManager: IUser | null;
  _id: string;
}

export interface IOrderResponse extends IResponseFields {
  Order: IOrderFromResponse;
}

export interface IOrdersResponse extends IResponseFields {
  Orders: IOrderFromResponse[];
}

export interface IOrderResponseSorted extends IOrdersResponse, IPagination {
  sorting: ISorting<OrderSortFields>;
  status: ORDER_STATUSES[];
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

export interface IOrderCommentResponse {
  createdOn: string;
  text: string;
  _id: string;
}
export interface IOrderCommentRequest {
  comment: string;
}

export interface IOrderHistoryItem {
  status: ORDER_STATUSES;
  customer: string;
  products: IProductInOrder[];
  total_price: number;
  delivery: IDelivery | null;
  changedOn: string;
  action: ORDER_HISTORY_ACTIONS;
  performer: IUser;
  assignedManager: IUser | null;
}
