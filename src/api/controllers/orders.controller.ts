import { APIRequestContext } from '@playwright/test';
import { RequestApi } from 'api/apiClients/request';
import { apiConfig } from 'config/apiConfig';
import { IRequestOptions } from 'types/api.types';
import { IOrderCommentRequest, IOrderFromResponse, IOrderRequest, IOrderResponseSorted } from 'types/orders.types';
import { logStep } from 'utils/reporter.utils';
import { convertRequestParams } from 'utils/requestParams.utils';

export class OrdersController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep('Send get order by id request')
  async getByIdOrder(token: string, id: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDERS_BY_ID(id),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderFromResponse>(options);
  }

  @logStep('Send delete order request')
  async deleteOrder(token: string, id: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDERS_BY_ID(id),
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<null>(options);
  }

  @logStep('Send put order request')
  async updateOrder(token: string, id: string, body: IOrderRequest) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDERS_BY_ID(id),
      method: 'put',
      data: body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderFromResponse>(options);
  }

  @logStep('Send create order request')
  async createOrder(token: string, body: IOrderRequest) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDERS,
      method: 'post',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderFromResponse>(options);
  }

  @logStep('Send getAllSorted orders request')
  async getAllSortedOrders(token: string, params?: Record<string, string>) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDERS + (params ? convertRequestParams(params) : ''),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponseSorted>(options);
  }

  @logStep('Send assign manager request')
  async assignManager(token: string, orderId: string, managerId: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ASSIGN_MANAGER(orderId, managerId),
      method: 'put',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderFromResponse>(options);
  }

  @logStep('Send unassign manager request')
  async unassignManager(token: string, orderId: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.UNASSIGN_MANAGER(orderId),
      method: 'put',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderFromResponse>(options);
  }
  @logStep('Send add comment request to order ')
  async addComment(token: string, orderId: string, body: IOrderCommentRequest) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_COMMENTS_ADD(orderId),
      method: 'post',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderFromResponse>(options);
  }

  @logStep('Send delete comment request to order ')
  async deleteComment(token: string, orderId: string, commentId: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_COMMENTS_DELETE(orderId, commentId),
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<null>(options);
  }
}
