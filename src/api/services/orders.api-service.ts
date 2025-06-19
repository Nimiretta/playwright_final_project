import { APIRequestContext } from '@playwright/test';
import { OrdersController } from 'api/controllers';
import { ORDER_STATUSES } from 'data/orders';
import { orderSchema } from 'data/schemas/orders/order.schema';
import { ordersWithSortAndFilter } from 'data/schemas/orders/ordersWithSortAndFilter.schema';
import { STATUS_CODES } from 'data/statusCodes.data';
import { IDelivery, IOrderCommentRequest, IOrderRequest, IOrderSortRequest } from 'types/orders.types';
import { logStep } from 'utils';
import { validateDeleteResponse, validateResponse } from 'utils/validations/responseValidation.utils';
import { validateSchema } from 'utils/validations/schemaValidation.utils';

export class OrdersApiService {
  private controller: OrdersController;

  constructor(request: APIRequestContext) {
    this.controller = new OrdersController(request);
  }

  @logStep('Get order by ID')
  async getById(id: string, token: string) {
    const response = await this.controller.getById(id, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Get sorted & filtered list of orders')
  async getAll(token: string, params?: IOrderSortRequest) {
    const response = await this.controller.getAllSorted(token, params);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(ordersWithSortAndFilter, response.body);
    return response.body;
  }

  @logStep('Update order')
  async updateOrder(id: string, body: IOrderRequest, token: string) {
    const response = await this.controller.update(id, body, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Update status order')
  async updateStatus(id: string, status: ORDER_STATUSES, token: string) {
    const response = await this.controller.updateStatus(id, status, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Update delivery')
  async updateDelivery(id: string, body: IDelivery, token: string) {
    const response = await this.controller.updateDelivery(id, body, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Delete order')
  async deleteOrder(id: string, token: string) {
    const response = await this.controller.delete(id, token);
    validateDeleteResponse(response);
  }

  @logStep('Add comment')
  async addComment(orderId: string, body: IOrderCommentRequest, token: string) {
    const response = await this.controller.addComment(orderId, body, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Delete comment')
  async deleteComment(orderId: string, commentId: string, token: string) {
    const response = await this.controller.deleteComment(orderId, commentId, token);
    validateDeleteResponse(response);
  }

  @logStep('Assign manager to order')
  async assignManager(orderId: string, managerId: string, token: string) {
    const response = await this.controller.assignManager(orderId, managerId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Unassign manager from order')
  async unassignManager(orderId: string, token: string) {
    const response = await this.controller.unassignManager(orderId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }
}
