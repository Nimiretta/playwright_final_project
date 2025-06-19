import { APIRequestContext } from '@playwright/test';
import { CustomersController, OrdersController, ProductsController } from 'api/controllers';
import { STATUS_CODES } from 'data';
import { generateCustomerData } from 'data/customers';
import { generateCommentData, ORDER_STATUSES } from 'data/orders';
import { generateProductData } from 'data/products';
import { orderSchema, ordersWithSortAndFilter } from 'data/schemas';
import { IDelivery, IOrderCommentRequest, IOrderRequest, IOrderSortRequest } from 'types/orders.types';
import { logStep } from 'utils';
import { validateDeleteResponse, validateResponse, validateSchema } from 'utils/validations';

export class OrdersApiService {
  private controller: OrdersController;
  private customersController: CustomersController;
  private productsController: ProductsController;

  constructor(request: APIRequestContext) {
    this.controller = new OrdersController(request);
    this.customersController = new CustomersController(request);
    this.productsController = new ProductsController(request);
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

  @logStep('Update order by customer')
  async updateByCustomer(id: string, body: IOrderRequest, token: string) {
    const customerBodyReq = generateCustomerData();
    const customer = await this.customersController.create(customerBodyReq, token);
    const updatedBody: IOrderRequest = {
      ...body,
      customer: customer.body.Customer._id,
    };
    const response = await this.controller.update(id, updatedBody, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Update order by products')
  async updateByProducts(id: string, body: IOrderRequest, token: string) {
    const productsIdArr: string[] = [];
    const productrBodyReq = generateProductData();
    const product = await this.productsController.create(productrBodyReq, token);
    productsIdArr.push(product.body.Product._id);
    const updatedBody: IOrderRequest = {
      ...body,
      products: productsIdArr,
    };
    const response = await this.controller.update(id, updatedBody, token);
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
    const comment = body.comment ? body : generateCommentData();
    const response = await this.controller.addComment(orderId, comment, token);
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

  @logStep('Mark products as received in order')
  async receiveProduct(orderId: string, prodID: string[], token: string) {
    const response = await this.controller.receiveProduct(orderId, prodID, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }
}
