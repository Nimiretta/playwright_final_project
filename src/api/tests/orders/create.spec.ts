import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { orderTestData } from 'data/orders/createOrderTestData';
import { errorResponseSchema, orderSchema } from 'data/schemas';
import { expect, test } from 'fixtures';
import _ from 'lodash';
import { ICustomerFromResponse, IOrderResponse, IProductFromResponse, IResponse } from 'types';
import { generateID } from 'utils';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Orders] [Create]', () => {
  let token = '';
  let customer: ICustomerFromResponse;
  let products: IProductFromResponse[];
  let orderResponse: IResponse<IOrderResponse>;
  const productIds: string[] = [];

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ ordersApiService, customersApiService, productsApiService }) => {
    if (orderResponse.status !== STATUS_CODES.CREATED) {
      if (!customer) {
        return;
      } else await customersApiService.delete(customer._id, token);
      if (!products) {
        return;
      } else await Promise.all(products.map((product) => productsApiService.delete(product._id, token)));
    } else ordersApiService.clear(token);
  });

  test(
    'Should create order with all valid data (token, valid customerId, productId) and one product',
    { tag: ['@001_O_POST_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService, productsApiService }) => {
      customer = await customersApiService.create(token);
      products = [await productsApiService.create(token)];
      products.forEach((product) => productIds.push(product._id));
      orderResponse = await ordersController.create({ customer: customer._id, products: productIds }, token);
      validateResponse(orderResponse, STATUS_CODES.CREATED, true, null);
      validateSchema(orderSchema, orderResponse.body);
      expect.soft(customer).toMatchObject({ ...orderResponse.body.Order.customer });
      products.forEach((product) => {
        expect
          .soft(product)
          .toMatchObject(
            _.omit({ ...orderResponse.body.Order.products.find((value) => product._id === value._id) }, ['received']),
          );
      });
      expect.soft(orderResponse.body.Order.status).toBe('Draft');
      expect
        .soft(orderResponse.body.Order.total_price)
        .toBe(products.reduce((price, product) => price + product.price, 0));
    },
  );

  test(
    'Should create order with all valid data (token, valid customerId, productId) and 5 products',
    { tag: ['@002_O_POST_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService, productsApiService }) => {
      customer = await customersApiService.create(token);
      products = await productsApiService.createBulk(5, token);
      products.forEach((product) => productIds.push(product._id));
      orderResponse = await ordersController.create({ customer: customer._id, products: productIds }, token);
      validateResponse(orderResponse, STATUS_CODES.CREATED, true, null);
      validateSchema(orderSchema, orderResponse.body);
      expect.soft(customer).toMatchObject({ ...orderResponse.body.Order.customer });
      products.forEach((product) => {
        expect
          .soft(product)
          .toMatchObject(
            _.omit({ ...orderResponse.body.Order.products.find((value) => product._id === value._id) }, ['received']),
          );
      });
      expect.soft(orderResponse.body.Order.status).toBe('Draft');
      expect
        .soft(orderResponse.body.Order.total_price)
        .toBe(products.reduce((price, product) => price + product.price, 0));
    },
  );

  test(
    'Should not create order with all valid data (token, valid customerId, productId) and 6 products',
    { tag: ['@003_O_POST_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService, productsApiService }) => {
      customer = await customersApiService.create(token);
      products = await productsApiService.createBulk(6, token);
      products.forEach((product) => productIds.push(product._id));
      orderResponse = await ordersController.create({ customer: customer._id, products: productIds }, token);
      validateResponse(orderResponse, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.ORDER_BAD_REQUEST);
      validateSchema(errorResponseSchema, orderResponse.body);
    },
  );

  orderTestData.forEach((data) => {
    test(data.testName, { tag: data.tag }, async ({ ordersController, customersApiService, productsApiService }) => {
      customer = await customersApiService.create(token);
      products = [await productsApiService.create(token)];
      products.forEach((product) => productIds.push(product._id));
      orderResponse = await ordersController.create(
        { customer: data.customer ?? customer._id, products: data.products ?? productIds },
        data.token ?? token,
      );
      validateResponse(orderResponse, data.status, false, data.error);
      validateSchema(errorResponseSchema, orderResponse.body);
    });
  });

  test(
    'Should not create order with invalid customerId',
    { tag: ['@008_O_POST_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, productsApiService }) => {
      const invalidCustomerId = generateID();
      products = [await productsApiService.create(token)];
      products.forEach((product) => productIds.push(product._id));
      orderResponse = await ordersController.create({ customer: invalidCustomerId, products: productIds }, token);
      validateResponse(orderResponse, STATUS_CODES.NOT_FOUND, false, API_ERRORS.CUSTOMER_NOT_FOUND(invalidCustomerId));
      validateSchema(errorResponseSchema, orderResponse.body);
    },
  );

  test(
    'Should not create order with 1 invalid productId',
    { tag: ['@011_O_POST_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService }) => {
      customer = await customersApiService.create(token);
      const invalidaProductId = generateID();
      orderResponse = await ordersController.create({ customer: customer._id, products: [invalidaProductId] }, token);
      validateResponse(
        orderResponse,
        STATUS_CODES.NOT_FOUND,
        false,
        API_ERRORS.PRODUCT_NOT_FOUND(invalidaProductId[0]),
      );
      validateSchema(errorResponseSchema, orderResponse.body);
    },
  );

  test(
    'Should not create order if one of productIds is invalid',
    { tag: ['@012_O_POST_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService, productsApiService }) => {
      customer = await customersApiService.create(token);
      products = await productsApiService.createBulk(3, token);
      products.forEach((product) => productIds.push(product._id));
      const invalidaProductId = generateID();
      productIds.push(invalidaProductId);
      orderResponse = await ordersController.create({ customer: customer._id, products: productIds }, token);
      validateResponse(orderResponse, STATUS_CODES.NOT_FOUND, false, API_ERRORS.PRODUCT_NOT_FOUND(invalidaProductId));
      validateSchema(errorResponseSchema, orderResponse.body);
    },
  );
});
