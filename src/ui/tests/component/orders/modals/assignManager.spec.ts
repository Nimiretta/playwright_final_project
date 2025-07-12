import { TAGS } from 'data';
import { generateCustomerData } from 'data/customers';
import { modalTitle, ORDER_STATUSES, mockManager } from 'data/orders';
import { generateProductData } from 'data/products';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';
import { generateID } from 'utils';

test.describe('[UI] [Orders] [Component] Assign New Manager Modal', async () => {
  let mockOrder: IOrderResponse;

  test.beforeEach(async ({ orderDetailsPage, mock }) => {
    mockOrder = {
      Order: {
        customer: { ...generateCustomerData(), _id: generateID(), createdOn: new Date().toISOString() },
        products: [{ ...generateProductData(), _id: generateID(), received: false }],
        createdOn: new Date().toISOString(),
        total_price: 100,
        comments: [],
        history: [],
        assignedManager: null,
        status: ORDER_STATUSES.DRAFT,
        delivery: null,
        _id: generateID(),
      },
      IsSuccess: true,
      ErrorMessage: null,
    };

    await mock.users({
      Users: [mockManager],
      IsSuccess: true,
      ErrorMessage: null,
    });
    await mock.orderDetails(mockOrder);
    await orderDetailsPage.open(mockOrder.Order._id);
  });

  test(
    'Should display all buttons & title modal',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.COMPONENT] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickAddAssignManager();
      await assignManagerModal.select(mockManager._id);

      await expect.soft(assignManagerModal.title).toContainText(modalTitle.assignManager);
      await expect.soft(assignManagerModal.confirmButton).toBeVisible();
      await expect.soft(assignManagerModal.confirmButton).toBeEnabled();
      await expect.soft(assignManagerModal.cancelButton).toBeVisible();
      await expect.soft(assignManagerModal.cancelButton).toBeEnabled();
      await expect.soft(assignManagerModal.closeButton).toBeVisible();
      await expect.soft(assignManagerModal.closeButton).toBeEnabled();
    },
  );

  test('Should disable Save button when no manager selected', async ({ assignManagerModal, orderDetailsPage }) => {
    await orderDetailsPage.clickAddAssignManager();
    await assignManagerModal.getManagersList();
    await expect(assignManagerModal.confirmButton).toBeDisabled();
  });

  test(
    'Should display  Manager via Search',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.COMPONENT] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickAddAssignManager();

      const mockinfo = `${mockManager.firstName} ${mockManager.lastName} (${mockManager.username})`;

      await assignManagerModal.search(mockManager.firstName);
      const infoByFirstName = await assignManagerModal.getManager(mockManager._id);
      expect.soft(infoByFirstName, 'Search by firstName and verify result').toBe(mockinfo);

      await assignManagerModal.search(mockManager.lastName);
      const infoByLastName = await assignManagerModal.getManager(mockManager._id);
      expect.soft(infoByLastName, 'Search by lastName and verify result').toBe(mockinfo);

      await assignManagerModal.search(mockManager.username);
      const infoByUserName = await assignManagerModal.getManager(mockManager._id);
      expect.soft(infoByUserName, 'Search by username and verify result').toBe(mockinfo);
    },
  );

  test(
    ' Should disable Save button if  no search manager  result',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.COMPONENT] },
    async ({ assignManagerModal, orderDetailsPage }) => {
      await orderDetailsPage.clickAddAssignManager();
      await assignManagerModal.fillSearch('abc');
      await expect(assignManagerModal.confirmButton).toBeDisabled();
    },
  );
});

test.describe('[UI] [Orders] [Component] Edit Assigned Manager Modal', async () => {
  let mockOrder: IOrderResponse;

  test.beforeEach(async ({ orderDetailsPage, mock }) => {
    mockOrder = {
      Order: {
        customer: { ...generateCustomerData(), _id: generateID(), createdOn: new Date().toISOString() },
        products: [{ ...generateProductData(), _id: generateID(), received: false }],
        createdOn: new Date().toISOString(),
        total_price: 100,
        comments: [],
        history: [],
        assignedManager: mockManager,
        status: ORDER_STATUSES.DRAFT,
        delivery: null,
        _id: generateID(),
      },
      IsSuccess: true,
      ErrorMessage: null,
    };

    await mock.users({
      Users: [mockManager],
      IsSuccess: true,
      ErrorMessage: null,
    });

    await mock.orderDetails(mockOrder);
    await orderDetailsPage.open(mockOrder.Order._id);
  });
  test(
    'Should display all buttons & title modal',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.COMPONENT] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickEditAssignManager();

      await expect.soft(assignManagerModal.title).toContainText(modalTitle.editAssignManager);
      await expect.soft(assignManagerModal.confirmButton).toBeVisible();
      await expect
        .soft(assignManagerModal.confirmButton, 'Verify Save is disabled if new  Manager not selected')
        .toBeDisabled();
      await expect.soft(assignManagerModal.cancelButton).toBeVisible();
      await expect.soft(assignManagerModal.cancelButton).toBeEnabled();
      await expect.soft(assignManagerModal.closeButton).toBeVisible();
      await expect.soft(assignManagerModal.closeButton).toBeEnabled();
    },
  );

  test(
    'Should display actual assigned manager',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.COMPONENT] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickEditAssignManager();

      const mockinfo = `${mockManager.firstName} ${mockManager.lastName} (${mockManager.username})`;
      const currentActiveManager = await assignManagerModal.getActiveManagerInfo();

      expect(currentActiveManager, 'Verify current active manager').toBe(mockinfo);
    },
  );

  test(
    'Should display  Manager via Search',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.COMPONENT] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickEditAssignManager();

      const mockinfo = `${mockManager.firstName} ${mockManager.lastName} (${mockManager.username})`;

      await assignManagerModal.search(mockManager.firstName);
      const infoByFirstName = await assignManagerModal.getManager(mockManager._id);
      expect.soft(infoByFirstName, 'Search by firstName and verify result').toBe(mockinfo);

      await assignManagerModal.search(mockManager.lastName);
      const infoByLastName = await assignManagerModal.getManager(mockManager._id);
      expect.soft(infoByLastName, 'Search by lastName and verify result').toBe(mockinfo);

      await assignManagerModal.search(mockManager.username);
      const infoByUserName = await assignManagerModal.getManager(mockManager._id);
      expect.soft(infoByUserName, 'Search by username and verify result').toBe(mockinfo);
    },
  );

  test(
    'Should disable Save button if no search manager result',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.COMPONENT] },
    async ({ assignManagerModal, orderDetailsPage }) => {
      await orderDetailsPage.clickEditAssignManager();
      await assignManagerModal.fillSearch('abc');
      await expect(assignManagerModal.confirmButton).toBeDisabled();
    },
  );
});
