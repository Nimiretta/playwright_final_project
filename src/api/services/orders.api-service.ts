import { APIRequestContext } from '@playwright/test';
import { OrdersController } from 'api/controllers';
import { generateDeliveryData, ORDER_STATUSES } from 'data/orders';
import { ordersWithSortAndFilter, orderSchema } from 'data/schemas';
import { STATUS_CODES } from 'data';
import { logStep, extractIds } from 'utils';
import {
  IOrderOptions,
  IOrderSortRequest,
  IOrderRequest,
  IOrderCommentRequest,
  IProduct,
  IOrderOptionsWithDelivery,
  IDeliveryOptions,
} from 'types';
import { validateResponse, validateSchema, validateDeleteResponse } from 'utils/validations';
import { CustomersApiService, ProductsApiService } from '.';

export class OrdersApiService {
  private controller: OrdersController;
  private customerService: CustomersApiService;
  private productsService: ProductsApiService;
  private customers: Set<string>;
  private products: Set<string>;
  private orders: Set<string>;

  constructor(request: APIRequestContext) {
    this.controller = new OrdersController(request);
    this.customerService = new CustomersApiService(request);
    this.productsService = new ProductsApiService(request);
    this.customers = new Set();
    this.products = new Set();
    this.orders = new Set();
  }

  @logStep('Create repeated product IDs for order')
  private async createRepeatedProductIds(
    count: number,
    token: string,
    productData?: Partial<IProduct>,
  ): Promise<string[]> {
    const product = await this.productsService.create(token, productData);
    this.products.add(product._id);
    return Array(count).fill(product._id);
  }

  @logStep('Create unique product IDs for order')
  private async createUniqueProductIds(
    count: number,
    token: string,
    productData?: Partial<IProduct>,
  ): Promise<string[]> {
    const products = await this.productsService.createBulk(count, token, productData);
    products.forEach((product) => this.products.add(product._id));
    return extractIds(products);
  }

  @logStep('Create draft order w/o delivery and get created order via API')
  async createDraft(token: string, options?: IOrderOptions) {
    const { productCount = 1, isUniqueProducts = true, customerData, productData } = options || {};

    const customer = (await this.customerService.create(token, customerData))._id;
    this.customers.add(customer);

    const products = isUniqueProducts
      ? await this.createUniqueProductIds(productCount, token, productData)
      : await this.createRepeatedProductIds(productCount, token, productData);

    const response = await this.controller.create({ customer, products }, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    validateSchema(orderSchema, response.body);
    this.orders.add(response.body.Order._id);
    return response.body.Order;
  }

  @logStep('Create canceled order w/o delivery and get order via API')
  async createCanceled(token: string, options?: IOrderOptions) {
    const draftId = (await this.createDraft(token, options))._id;
    const canceled = await this.updateStatus(draftId, ORDER_STATUSES.CANCELED, token);
    return canceled;
  }

  @logStep('Create draft order with delivery and get created order via API')
  async createDraftWithDelivery(token: string, options?: IOrderOptionsWithDelivery) {
    const { deliveryData, ...orderOptions } = options || {};
    const draftId = (await this.createDraft(token, orderOptions))._id;
    const draftWithDelivery = await this.updateDelivery(draftId, token, deliveryData);
    return draftWithDelivery;
  }

  @logStep('Create order In process and get created order via API')
  async createInProcess(token: string, options?: IOrderOptionsWithDelivery) {
    const draftId = (await this.createDraftWithDelivery(token, options))._id;
    const inProcess = await this.updateStatus(draftId, ORDER_STATUSES.IN_PROCESS, token);
    return inProcess;
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
  async updateDelivery(id: string, token: string, customData?: IDeliveryOptions) {
    const body = generateDeliveryData(customData);
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
