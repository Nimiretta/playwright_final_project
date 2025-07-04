import { apiConfig } from 'config';
import { STATUS_CODES, TAGS } from 'data';
import { test, expect } from 'fixtures';
import { IOrderFromResponse } from 'types';

test.describe('[E2E] [UI] [Orders] [Assign Manager]', () => {
  let token = '';
  let order: IOrderFromResponse;
  const userId = '6806a732d006ba3d475fc11c';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });
  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should be possible to assign manager to order "Draft"',
    { tag: ['@001_O_AM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickAddAssignManager();
      await orderDetailsPage.assignManagerModal.waitForOpened();
      await orderDetailsPage.assignManagerModal.select(userId);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ASSIGN_MANAGER(order._id, userId),
        async () => await orderDetailsPage.assignManagerModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
    },
  );

  test(
    'Should be possible to assign manager to order "In Process"',
    { tag: ['@002_O_AM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createInProcess(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickAddAssignManager();
      await orderDetailsPage.assignManagerModal.waitForOpened();
      await orderDetailsPage.assignManagerModal.select(userId);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ASSIGN_MANAGER(order._id, userId),
        async () => await orderDetailsPage.assignManagerModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
    },
  );

  test(
    'Should be possible to assign manager to order "Canceled"',
    { tag: ['@003_O_AM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createCanceled(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickAddAssignManager();
      await orderDetailsPage.assignManagerModal.waitForOpened();
      await orderDetailsPage.assignManagerModal.select(userId);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ASSIGN_MANAGER(order._id, userId),
        async () => await orderDetailsPage.assignManagerModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
    },
  );

  test(
    'Should be possible to assign manager to order "Partially Received"',
    { tag: ['@004_O_AM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createPartiallyReceived(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickAddAssignManager();
      await orderDetailsPage.assignManagerModal.waitForOpened();
      await orderDetailsPage.assignManagerModal.select(userId);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ASSIGN_MANAGER(order._id, userId),
        async () => await orderDetailsPage.assignManagerModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
    },
  );

  test(
    'Should be possible to assign manager to order "Received"',
    { tag: ['@005_O_AM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createPartiallyReceived(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickAddAssignManager();
      await orderDetailsPage.assignManagerModal.waitForOpened();
      await orderDetailsPage.assignManagerModal.select(userId);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ASSIGN_MANAGER(order._id, userId),
        async () => await orderDetailsPage.assignManagerModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
    },
  );
});
