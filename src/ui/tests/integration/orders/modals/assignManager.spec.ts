import { TAGS } from 'data';
import { mockManager } from 'data/orders/mock.data';
import { expect, test } from 'fixtures';
import { IOrderFromResponse } from 'types';

test.describe('[UI] [Orders] Assign Manager Modal', async function () {
  let token = '';
  let order: IOrderFromResponse;

  test.beforeEach(async ({ signInApiService, orderDetailsPage, mock, ordersApiService }) => {
    token = await signInApiService.getAuthToken();
    order = await ordersApiService.createDraft(token);
    await orderDetailsPage.open(order._id);
    await mock.users({
      Users: [mockManager],
      IsSuccess: true,
      ErrorMessage: null,
    });
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Assign a New Manager',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE] },
    async function ({ orderDetailsPage, assignManagerModal }) {
      await orderDetailsPage.clickAddAssignManager();

      await assignManagerModal.select(mockManager._id);

      const info = await assignManagerModal.getManager(mockManager._id);

      const mockinfo = `${mockManager.firstName} ${mockManager.lastName} (${mockManager.username})`;

      await test.step('Selected manager info should match mocked manager', async () => {
        expect.soft(info).toBe(mockinfo);
      });

      await assignManagerModal.checkCommonUI('Assign Manager');

      await assignManagerModal.submit();
      await assignManagerModal.waitForClosed();

      await test.step('Verify Manager name on orderDetailsPage ', async () => {
        const mockManagerName = `${mockManager.firstName} ${mockManager.lastName}`;
        await expect.soft(orderDetailsPage.assignedManagerName).toHaveText(mockManagerName);
      });
    },
  );

  test(
    'Assign Manager via Search',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE] },
    async function ({ orderDetailsPage, assignManagerModal }) {
      await orderDetailsPage.clickAddAssignManager();
      const mockinfo = `${mockManager.firstName} ${mockManager.lastName} (${mockManager.username})`;

      await test.step('Search by firstName and verify result', async () => {
        await assignManagerModal.search(mockManager.firstName);
        const infoByFirstName = await assignManagerModal.getManager(mockManager._id);
        expect.soft(infoByFirstName).toBe(mockinfo);
      });

      await test.step('Search by lastName and verify result', async () => {
        await assignManagerModal.search(mockManager.lastName);
        const infoByLastName = await assignManagerModal.getManager(mockManager._id);
        expect.soft(infoByLastName).toBe(mockinfo);
      });

      await test.step('Search by username and verify result', async () => {
        await assignManagerModal.search(mockManager.username);
        const infoByUserName = await assignManagerModal.getManager(mockManager._id);
        expect.soft(infoByUserName).toBe(mockinfo);
      });

      await assignManagerModal.checkCommonUI('Assign Manager');

      await assignManagerModal.submit();
      await assignManagerModal.waitForClosed();

      await test.step('Verify Manager name on orderDetailsPage ', async () => {
        const mockManagerName = `${mockManager.firstName} ${mockManager.lastName}`;
        await expect.soft(orderDetailsPage.assignedManagerName).toHaveText(mockManagerName);
      });
    },
  );
});
