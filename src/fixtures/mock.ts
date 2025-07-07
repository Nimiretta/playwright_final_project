import { Page } from '@playwright/test';
import { apiConfig } from 'config';
import { STATUS_CODES } from 'data';
import { ICustomerResponse, ICustomersResponse, IOrdersResponse, IProductResponse, IProductsResponse } from 'types';

export class Mock {
  constructor(private page: Page) {}

  async customers(body: ICustomersResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/customers(\/all)?(\?.*)?$/, async (route) => {
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
    this.page.route(/\/api\/products(\/all)?(\?.*)?$/, async (route) => {
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

  async orders(body: IOrdersResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/orders(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }
}
