import { STATUS_CODES, TAGS } from 'data';
import { expect, test } from 'fixtures';
import { ICustomerFromResponse, IOrderResponse, IProductFromResponse, IResponse } from 'types';

test.describe('[E2E] [UI] [Orders] [Create]', () => {
  let customer: ICustomerFromResponse;
  let products: IProductFromResponse[];
  let order: IResponse<IOrderResponse>;

  let token = '';
  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ customersApiService, productsApiService, ordersApiService }) => {
    await ordersApiService.deleteOrder(order.body.Order._id, token);
    await customersApiService.delete(customer._id, token);
    await Promise.all(products.map((product) => productsApiService.delete(product._id, token)));
  });
  test(
    'Should create order with one product',
    { tag: ['@001_O_CREATE_E2E', TAGS.E2E] },
    async ({ ordersPage, customersApiService, productsApiService }) => {
      customer = await customersApiService.create(token);
      products = await productsApiService.createBulk(1, token);
      const productNames = products.map((el) => el.name);
      await ordersPage.openPage('ORDERS');
      await ordersPage.waitForOpened();
      await ordersPage.clickCreateButton();
      await ordersPage.createOrderModal.waitForOpened();
      await ordersPage.createOrderModal.selectCustomer(customer.name);
      await ordersPage.createOrderModal.selectProducts(...productNames);
      order = await ordersPage.createOrderModal.submit();
      expect(order.status).toBe(STATUS_CODES.CREATED);
    },
  );
  test(
    'Should create order with max number of products',
    { tag: ['@002_O_CREATE_E2E', TAGS.E2E] },
    async ({ ordersPage, customersApiService, productsApiService }) => {
      customer = await customersApiService.create(token);
      products = await productsApiService.createBulk(5, token);
      const productNames = products.map((el) => el.name);
      await ordersPage.openPage('ORDERS');
      await ordersPage.waitForOpened();
      await ordersPage.clickCreateButton();
      await ordersPage.createOrderModal.waitForOpened();
      await ordersPage.createOrderModal.selectCustomer(customer.name);
      await ordersPage.createOrderModal.selectProducts(...productNames);
      order = await ordersPage.createOrderModal.submit();
      expect(order.status).toBe(STATUS_CODES.CREATED);
    },
  );
});
