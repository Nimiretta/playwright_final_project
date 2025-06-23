import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { ORDER_HISTORY_ACTIONS, ORDER_STATUSES } from 'data/orders';
import { errorResponseSchema, orderSchema } from 'data/schemas';
import { expect, test } from 'fixtures';
import { IOrderFromResponse } from 'types';
import { generateID } from 'utils';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Orders] [Mark Products as Received | from status In Process]', () => {
  let token = '';
  let order: IOrderFromResponse;

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should mark all (1>) products as received',
    {
      tag: ['@001_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const prodID: string[] = [];
      order = await ordersApiService.createInProcess(token, { productCount: 5 });
      order.products.forEach((product) => {
        prodID.push(product._id);
      });
      const response = await ordersController.receiveProduct(order._id, prodID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated order status is RECEIVED', () => {
        expect.soft(response.body.Order.status).toEqual(ORDER_STATUSES.RECEIVED);
      });
      await test.step('Validated order history has RECEIVED_ALL action and RECEIVED status', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.RECEIVED_ALL);
        expect.soft(response.body.Order.history[0].status).toBe(ORDER_STATUSES.RECEIVED);
      });
      await test.step('Validated all products are marked as received', () => {
        expect.soft(response.body.Order.products.every((product) => product.received)).toBeTruthy();
      });
    },
  );

  test(
    'Should mark ONE product as received',
    {
      tag: ['@002_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const prodID: string[] = [];
      order = await ordersApiService.createInProcess(token, { productCount: 1 });
      order.products.forEach((product) => {
        prodID.push(product._id);
      });
      const response = await ordersController.receiveProduct(order._id, prodID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated order status is RECEIVED', () => {
        expect.soft(response.body.Order.status).toEqual(ORDER_STATUSES.RECEIVED);
      });
      await test.step('Validated order history has RECEIVED_ALL action and RECEIVED status', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.RECEIVED_ALL);
        expect.soft(response.body.Order.history[0].status).toBe(ORDER_STATUSES.RECEIVED);
      });
      await test.step('Validated product is marked as received', () => {
        expect.soft(response.body.Order.products[0].received).toBeTruthy();
      });
    },
  );

  test(
    'Should mark some products (one from two) as  PARTIALLY received',
    {
      tag: ['@003_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const prodID: string[] = [];
      order = await ordersApiService.createInProcess(token, { productCount: 2 });
      order.products.forEach((product) => {
        prodID.push(product._id);
      });
      const response = await ordersController.receiveProduct(order._id, [prodID[0]], token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated order status is PARTIALLY_RECEIVED', () => {
        expect.soft(response.body.Order.status).toEqual(ORDER_STATUSES.PARTIALLY_RECEIVED);
      });
      await test.step('Validated first history action and status', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.RECEIVED);
        expect.soft(response.body.Order.history[0].status).toBe(ORDER_STATUSES.PARTIALLY_RECEIVED);
      });
      await test.step('Validated first product is received', () => {
        expect.soft(response.body.Order.products[0].received).toBeTruthy();
      });
      await test.step('Validated second history action and status', () => {
        expect.soft(response.body.Order.history[1].action).toBe(ORDER_HISTORY_ACTIONS.PROCESSED);
        expect.soft(response.body.Order.history[1].status).toBe(ORDER_STATUSES.IN_PROCESS);
      });
      await test.step('Validated second product is not received', () => {
        expect.soft(response.body.Order.products[1].received).toBeFalsy();
      });
    },
  );

  test(
    'Should not mark as received if product does not exist in order',
    {
      tag: ['@004_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token, { productCount: 1 });
      const nonExistentProdID = [generateID()];
      const response = await ordersController.receiveProduct(order._id, nonExistentProdID, token);

      validateResponse(
        response,
        STATUS_CODES.BAD_REQUEST,
        false,
        API_ERRORS.PRODUCT_IS_NOT_REQUESTED(nonExistentProdID[0]),
      );
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark as received if productID does not valid',
    {
      tag: ['@005_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token, { productCount: 1 });
      const invalidProdID = ['123'];
      const response = await ordersController.receiveProduct(order._id, invalidProdID, token);

      validateResponse(
        response,
        STATUS_CODES.BAD_REQUEST,
        false,
        API_ERRORS.PRODUCT_IS_NOT_REQUESTED(invalidProdID[0]),
      );
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark as received if productID is empty',
    {
      tag: ['@006_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token, { productCount: 1 });
      const emptyProdID = [''];
      const response = await ordersController.receiveProduct(order._id, emptyProdID, token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.PRODUCT_IS_NOT_REQUESTED(emptyProdID[0]));
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark as received with empty token',
    {
      tag: ['@007_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const prodID: string[] = [];
      const emptyToken = '';
      order = await ordersApiService.createInProcess(token, { productCount: 2 });
      order.products.forEach((product) => {
        prodID.push(product._id);
      });
      const response = await ordersController.receiveProduct(order._id, prodID, emptyToken);

      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark as received with invalid token',
    {
      tag: ['@008_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const prodID: string[] = [];
      const invalidToken = '12345';
      order = await ordersApiService.createInProcess(token, { productCount: 2 });
      order.products.forEach((product) => {
        prodID.push(product._id);
      });
      const response = await ordersController.receiveProduct(order._id, prodID, invalidToken);

      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
      validateSchema(errorResponseSchema, response.body);
    },
  );
});
