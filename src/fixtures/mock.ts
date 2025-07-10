import { Page } from '@playwright/test';
import { apiConfig } from 'config';
import { STATUS_CODES } from 'data';
import {
  ICustomerResponse,
  ICustomersResponse,
  IOrderResponse,
  IProductResponse,
  IProductsResponse,
  IResponseFields,
} from 'types';

export class Mock {
  constructor(private page: Page) {}

  async customers(body: ICustomersResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/customers(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async customerDetails(body: ICustomerResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + '/' + apiConfig.ENDPOINTS.CUSTOMER_BY_ID(body.Customer._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async products(body: IProductsResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/products(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async productDetails(body: IProductResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + '/' + apiConfig.ENDPOINTS.PRODUCT_BY_ID(body.Product._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async orderDetails(body: IOrderResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.unroute(apiConfig.BASE_URL + apiConfig.ENDPOINTS.ORDERS_BY_ID(body.Order._id));
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.ORDERS_BY_ID(body.Order._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async orderDetailsWithError(
    body: IOrderResponse,
    error: IResponseFields,
    statusCode: STATUS_CODES = STATUS_CODES.BAD_REQUEST,
  ) {
    await this.page.unroute(apiConfig.BASE_URL + apiConfig.ENDPOINTS.ORDERS_BY_ID(body.Order._id));
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.ORDERS_BY_ID(body.Order._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(error),
      });
    });
  }

  async allCustomers(customers: ICustomersResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.CUSTOMERS_ALL, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(customers),
      });
    });
  }

  async allCustomersWithError(errorBody: IResponseFields, statusCode: STATUS_CODES = STATUS_CODES.BAD_REQUEST) {
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.CUSTOMERS_ALL, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(errorBody),
      });
    });
  }
}
