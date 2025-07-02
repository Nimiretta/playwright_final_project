import { apiConfig } from 'config';
import { STATUS_CODES, TAGS } from 'data';
import { test, expect } from 'fixtures';
import { IOrderFromResponse, IProductFromResponse } from 'types';

test.describe('[UI] [E2E] [Orders] [Update Product]', () => {
  let token = '';
  let order: IOrderFromResponse;
  let products: IProductFromResponse[];
  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });
  test.afterEach(async ({ ordersApiService, productsApiService }) => {
    await ordersApiService.clear(token);
    if (!products) return;
    else await Promise.all(products.map((product) => productsApiService.delete(product._id, token)));
  });

  test(
    'Should update one product in order',
    { tag: ['@001_0_UPP_E2E', TAGS.E2E] },
    async ({ productsApiService, orderDetailsPage, ordersApiService }) => {
      products = await productsApiService.createBulk(1, token);
      order = await ordersApiService.createDraft(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickEditProductsButton();
      await orderDetailsPage.editProductsModal.waitForOpened();
      await orderDetailsPage.editProductsModal.selectProduct(products[0].name, order.products[0].name);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ORDERS_BY_ID(order._id),
        async () => await orderDetailsPage.editProductsModal.clickSaveButton(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
    },
  );

  test(
    'Should update order with several products',
    { tag: ['@002_0_UPP_E2E', TAGS.E2E] },
    async ({ productsApiService, orderDetailsPage, ordersApiService }) => {
      products = await productsApiService.createBulk(5, token);
      order = await ordersApiService.createDraft(token, { productCount: 5 });
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickEditProductsButton();
      await orderDetailsPage.editProductsModal.waitForOpened();
      await Promise.all(
        products.map((el, index) =>
          orderDetailsPage.editProductsModal.selectProduct(el.name, order.products[index].name),
        ),
      );
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ORDERS_BY_ID(order._id),
        async () => await orderDetailsPage.editProductsModal.clickSaveButton(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
    },
  );

  test(
    'Should be possible to add one more product to order',
    { tag: ['@003_0_UPP_E2E', TAGS.E2E] },
    async ({ orderDetailsPage, ordersApiService }) => {
      order = await ordersApiService.createDraft(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickEditProductsButton();
      await orderDetailsPage.editProductsModal.waitForOpened();
      await orderDetailsPage.editProductsModal.add();
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ORDERS_BY_ID(order._id),
        async () => await orderDetailsPage.editProductsModal.clickSaveButton(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
    },
  );

  test(
    'Should be possible to delete product from order',
    { tag: ['@004_0_UPP_E2E', TAGS.E2E] },
    async ({ orderDetailsPage, ordersApiService }) => {
      order = await ordersApiService.createDraft(token, { productCount: 2 });
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickEditProductsButton();
      await orderDetailsPage.editProductsModal.waitForOpened();
      await orderDetailsPage.editProductsModal.delete(order.products[1].name);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ORDERS_BY_ID(order._id),
        async () => await orderDetailsPage.editProductsModal.clickSaveButton(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
    },
  );
});
