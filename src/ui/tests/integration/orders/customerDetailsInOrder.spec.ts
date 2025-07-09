import { apiConfig } from 'config';
import { TAGS } from 'data';
import { convertCustomerToUIData } from 'data/orders';
import { mockData } from 'data/orders/mockOrder.data';
import { expect, test } from 'fixtures';
import { IOrderFromResponse } from 'types';

test.describe('[Integration] [Orders] [Customer Details]', () => {
  let token = '';
  let order: IOrderFromResponse;
  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  mockData.forEach((el) =>
    test(el.testName, { tag: el.tag }, async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(el.response);
      await orderDetailsPage.open(el.response.Order._id);
      await orderDetailsPage.waitForOpened();
      const customer = await orderDetailsPage.getCustomer();
      expect(convertCustomerToUIData(el.response.Order.customer)).toMatchObject(customer);
    }),
  );

  test(
    'Should display edit button if order is in Draft status',
    { tag: ['@003_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION, TAGS.SMOKE] },
    async ({ orderDetailsPage, ordersApiService }) => {
      order = await ordersApiService.createDraft(token);
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.editCutomerButton).toBeVisible();
    },
  );

  test(
    'Should not display edit button if order is in In Process status',
    { tag: ['@004_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION] },
    async ({ orderDetailsPage, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token);
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.editCutomerButton).not.toBeVisible();
    },
  );

  test(
    'Should open edit customer modal after clicking on the edit button',
    { tag: ['@005_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION, TAGS.SMOKE] },
    async ({ orderDetailsPage, ordersApiService }) => {
      order = await ordersApiService.createDraft(token);
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.editCutomerButton.click();
      await orderDetailsPage.clickEditCustomerButton();
      await orderDetailsPage.editCustomerModal.waitForOpened();
    },
  );

  test(
    'Should send correct request after clicking customer order',
    { tag: ['@006_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION] },
    async ({ orderDetailsPage, ordersApiService }) => {
      order = await ordersApiService.createDraft(token);
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.waitForOpened();
      const request = await orderDetailsPage.interceptRequest(apiConfig.ENDPOINTS.CUSTOMERS_ALL, () =>
        orderDetailsPage.clickEditCustomerButton(),
      );
      expect(request.url()).toBe(apiConfig.BASE_URL + apiConfig.ENDPOINTS.CUSTOMERS_ALL);
    },
  );

  test(
    'Should not display edit button if order is in Canceled status',
    { tag: ['@007_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION] },
    async ({ orderDetailsPage, ordersApiService }) => {
      order = await ordersApiService.createCanceled(token);
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.editCutomerButton).not.toBeVisible();
    },
  );

  test(
    'Should not display edit button if order is in Partially Received status',
    { tag: ['@008_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION] },
    async ({ orderDetailsPage, ordersApiService }) => {
      order = await ordersApiService.createPartiallyReceived(token);
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.editCutomerButton).not.toBeVisible();
    },
  );

  test(
    'Should not display edit button if order is in Received status',
    { tag: ['@009_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION] },
    async ({ orderDetailsPage, ordersApiService }) => {
      order = await ordersApiService.createReceived(token);
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.editCutomerButton).not.toBeVisible();
    },
  );
});
