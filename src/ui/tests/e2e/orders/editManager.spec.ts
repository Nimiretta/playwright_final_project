import { apiConfig } from 'config';
import { STATUS_CODES, TAGS } from 'data';
import { test, expect } from 'fixtures';
import { IOrderFromResponse } from 'types';

test.describe('[E2E] [UI] [Orders] [Assign Manager]', () => {
  let token = '';
  let order: IOrderFromResponse;
  const userId = '6806a732d006ba3d475fc11c';
  const secondUserId = '6840b3b41c508c5d5e50fd51';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });
  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should be possible to edit manager in order',
    { tag: ['@001_O_EM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage, homePage, ordersPage }) => {
      order = await ordersApiService.createDraft(token);
      order = await ordersApiService.assignManager(order._id, userId, token);
      await homePage.openPage('HOME');
      await homePage.waitForOpened();
      await homePage.clickCardButton('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickOrderDetails(order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickEditAssignManager();
      await orderDetailsPage.assignManagerModal.waitForOpened();
      await orderDetailsPage.assignManagerModal.select(secondUserId);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ASSIGN_MANAGER(order._id, secondUserId),
        async () => await orderDetailsPage.assignManagerModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
    },
  );
});
