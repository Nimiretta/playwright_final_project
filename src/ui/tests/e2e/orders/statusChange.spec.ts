import { ALERTS, TAGS } from 'data';
import { DELIVERY_CONDITIONS, ORDER_STATUSES } from 'data/orders';
import { test, expect } from 'fixtures';
import { IOrderFromResponse } from 'types';
import { generateValidDeliveryDate } from 'utils';

test.describe('[E2E] [UI] [Orders] [Status Change]', () => {
  let token = '';
  let order: IOrderFromResponse;
  const managerData = { id: '68196484d006ba3d4760a076', name: 'Barys Kotau' };

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });
  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should cancel order on Draft',
    { tag: ['@001_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickCancel();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_CANCELED);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status).toBe(ORDER_STATUSES.CANCELED);
      expect(orderDetailsPage.reopenOrderButton).toBeVisible();
    },
  );

  test(
    'Should reopen cancelled order to Draft',
    { tag: ['@002_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createCanceled(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickReopen();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_REOPEN);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status).toBe(ORDER_STATUSES.DRAFT);
      expect(orderDetailsPage.cancelOrderButton).toBeVisible();
    },
  );

  test(
    'Should cancel an order on Draft with delivery',
    { tag: ['@001_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraftWithDelivery(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickCancel();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_CANCELED);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status).toBe(ORDER_STATUSES.CANCELED);
      expect(orderDetailsPage.reopenOrderButton).toBeVisible();
    },
  );

  test(
    'Should cancel an order In progress',
    { tag: ['@001_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createInProcess(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickCancel();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_CANCELED);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status).toBe(ORDER_STATUSES.CANCELED);
      expect(orderDetailsPage.reopenOrderButton).toBeVisible();
    },
  );

  test(
    'Should cancel an order In process',
    { tag: ['@001_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createInProcess(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickCancel();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_CANCELED);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status).toBe(ORDER_STATUSES.CANCELED);
      expect(orderDetailsPage.reopenOrderButton).toBeVisible();
    },
  );

  test(
    'Should move the order from Draft to Draft with delivery',
    { tag: ['@001_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage, deliveryPage }) => {
      order = await ordersApiService.createDraft(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickDeliveryTab();
      const delivery = {
        condition: DELIVERY_CONDITIONS.DELIVERY,
        finalDate: generateValidDeliveryDate(),
      };
      await deliveryPage.fillInputs({ ...delivery, location: 'Home' });
      await deliveryPage.clickSave();
      await orderDetailsPage.waitForNotification(ALERTS.DELIVERY_SAVED);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status).toBe(ORDER_STATUSES.DRAFT);
    },
  );

  test(
    'Should cancel an order In process',
    { tag: ['@001_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraftWithDelivery(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickProcess();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_PROCESS);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status).toBe(ORDER_STATUSES.IN_PROCESS);
    },
  );

  test(
    'Should Receive order from In process with all products',
    { tag: ['@001_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createInProcess(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickReceiveButton();
      await orderDetailsPage.markAllproducts('check');
      await orderDetailsPage.clickSaveButton();
      await orderDetailsPage.waitForNotification(ALERTS.PRODUCTS_RECEIVED);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status).toBe(ORDER_STATUSES.RECEIVED);
    },
  );

  test(
    'Should Partially Receive order from In process with part of the products',
    { tag: ['@001_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createInProcess(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickReceiveButton();
      await orderDetailsPage.markSingleProduct('Product 1752358249844 ISdaWVJBAr', 'check');
      await orderDetailsPage.clickSaveButton();
      await orderDetailsPage.waitForNotification(ALERTS.PRODUCTS_RECEIVED);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status).toBe(ORDER_STATUSES.PARTIALLY_RECEIVED);
    },
  );
});
