import { ROLES, TAGS } from 'data';
import { mockManager } from 'data/orders/mock.data';
import { expect, test } from 'fixtures';
import { IOrderFromResponse, IUser } from 'types';

test.describe('[UI] [Orders] Assign New Manager Modal', async () => {
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
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickAddAssignManager();

      await assignManagerModal.select(mockManager._id);

      const managerInfo = await assignManagerModal.getManager(mockManager._id);

      const mockinfo = `${mockManager.firstName} ${mockManager.lastName} (${mockManager.username})`;

      await test.step('Selected manager info should match mocked manager', async () => {
        expect.soft(managerInfo).toBe(mockinfo);
      });

      await assignManagerModal.checkCommonUI('Assign Manager');

      await assignManagerModal.submit();

      await test.step('Verify Manager name on orderDetailsPage ', async () => {
        const mockManagerName = `${mockManager.firstName} ${mockManager.lastName}`;
        await expect.soft(orderDetailsPage.assignedManagerName).toHaveText(mockManagerName);
      });
    },
  );

  test(
    'Assign a New Manager via Search',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ orderDetailsPage, assignManagerModal }) => {
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

      await test.step('Verify Manager name on orderDetailsPage ', async () => {
        const mockManagerName = `${mockManager.firstName} ${mockManager.lastName}`;
        await expect.soft(orderDetailsPage.assignedManagerName).toHaveText(mockManagerName);
      });
    },
  );

  test(
    'Should disable Save if no Manager selected and Close modal without assignment',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickAddAssignManager();

      await test.step('Submit button should be disabled', async () => {
        await expect(assignManagerModal.confirmButton).toBeDisabled();
      });

      await assignManagerModal.close();

      await test.step('Verify no manager was assigned after closing', async () => {
        await expect(orderDetailsPage.noAssignedManagerText).toHaveText('Click to select manager');
      });
    },
  );

  test(
    'Should disable Save if Manager is not found and Cancel modal without assignment',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickAddAssignManager();

      await assignManagerModal.fillSearch('abc');

      await test.step('Check submit should be disabled', async () => {
        await expect(assignManagerModal.confirmButton).toBeDisabled();
      });

      await assignManagerModal.cancel();

      await test.step('Verify no manager was assigned after closing', async () => {
        await expect(orderDetailsPage.noAssignedManagerText).toHaveText('Click to select manager');
      });
    },
  );
});

test.describe('[UI] [Orders] Edit Assigned Manager Modal', async () => {
  let token = '';
  let order: IOrderFromResponse;
  let secondManager: IUser;

  test.beforeEach(async ({ signInApiService, orderDetailsPage, mock, ordersApiService }) => {
    token = await signInApiService.getAuthToken();
    order = await ordersApiService.createDraft(token);
    await ordersApiService.assignManager(order._id, mockManager._id, token);
    await orderDetailsPage.open(order._id);

    secondManager = {
      _id: '6807a561d006ba3d475fcb36',
      firstName: 'Tatiana',
      lastName: 'Korol',
      username: 'nimiretta',
      roles: [ROLES.USER],
      createdOn: '2025/04/22 14:19:13',
    };
    await mock.users({
      Users: [mockManager, secondManager],
      IsSuccess: true,
      ErrorMessage: null,
    });
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Change assigned manager',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickEditAssignManager();

      const mockinfo = `${mockManager.firstName} ${mockManager.lastName} (${mockManager.username})`;

      const currentActiveManager = await assignManagerModal.getActiveManagerInfo();

      await test.step('Verify current active manager', async () => {
        expect(currentActiveManager).toBe(mockinfo);
      });

      await test.step('Verify Save is disabled if new  Manager not selected', async () => {
        await expect(assignManagerModal.confirmButton).toBeDisabled();
      });

      await assignManagerModal.select(secondManager._id);

      await assignManagerModal.checkCommonUI('Edit Assigned Manager');

      await assignManagerModal.submit();

      await test.step('Verify Manager name on orderDetailsPage ', async () => {
        const mockManagerName = `${secondManager.firstName} ${secondManager.lastName}`;
        await expect.soft(orderDetailsPage.assignedManagerName).toHaveText(mockManagerName);
      });
    },
  );

  test(
    'Change assigned manager via Search',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickEditAssignManager();

      const secondManagerInfo = `${secondManager.firstName} ${secondManager.lastName} (${secondManager.username})`;

      await test.step('Search by firstName and verify result', async () => {
        await assignManagerModal.search(secondManager.firstName);
        const infoByFirstName = await assignManagerModal.getManager(secondManager._id);
        expect.soft(infoByFirstName).toBe(secondManagerInfo);
      });

      await test.step('Search by lastName and verify result', async () => {
        await assignManagerModal.search(secondManager.lastName);
        const infoByLastName = await assignManagerModal.getManager(secondManager._id);
        expect.soft(infoByLastName).toBe(secondManagerInfo);
      });

      await test.step('Search by username and verify result', async () => {
        await assignManagerModal.search(secondManager.username);
        const infoByUserName = await assignManagerModal.getManager(secondManager._id);
        expect.soft(infoByUserName).toBe(secondManagerInfo);
      });

      await assignManagerModal.checkCommonUI('Edit Assigned Manager');

      await assignManagerModal.submit();

      await test.step('Verify New Manager name on orderDetailsPage ', async () => {
        const newManagerName = `${secondManager.firstName} ${secondManager.lastName}`;
        await expect.soft(orderDetailsPage.assignedManagerName).toHaveText(newManagerName);
      });
    },
  );

  test(
    'Should close modal without assign new Manager',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickEditAssignManager();

      await assignManagerModal.close();

      const currentManagerName = `${mockManager.firstName} ${mockManager.lastName}`;
      await test.step('Verify current Manager on OrderDetailPage', async () => {
        await expect(orderDetailsPage.assignedManagerName).toHaveText(currentManagerName);
      });
    },
  );

  test(
    'Should Cancel without assign new Manager',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickEditAssignManager();

      await assignManagerModal.cancel();

      const currentManagerName = `${mockManager.firstName} ${mockManager.lastName}`;
      await test.step('Verify current Manager on OrderDetailPage', async () => {
        await expect(orderDetailsPage.assignedManagerName).toHaveText(currentManagerName);
      });
    },
  );
});
