import { ALERTS, TAGS } from 'data';
import { generateCustomerData } from 'data/customers';
import { generateDeliveryData, ORDER_STATUSES, mockManager } from 'data/orders';
import { generateProductData } from 'data/products';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';
import { generateID } from 'utils';

test.describe('[UI] [Orders] [Integration] [Cancel modal]', async () => {
  let mockOrder: IOrderResponse;
  let updatedOrder: IOrderResponse;

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

    updatedOrder = {
      ...mockOrder,
      Order: {
        ...mockOrder.Order,
        status: ORDER_STATUSES.CANCELED,
      },
    };

    await mock.orderDetails(mockOrder);
    await orderDetailsPage.open(mockOrder.Order._id);
  });

  test(
    'Should successfully cancel order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      await orderDetailsPage.clickCancel();

      await mock.changeOrderStatus(updatedOrder);
      await mock.orderDetails(updatedOrder);

      await confirmationModal.submit();

      await orderDetailsPage.waitForNotification(ALERTS.ORDER_CANCELED);

      await expect(orderDetailsPage.reopenOrderButton, 'Reopen Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should be CANCELED').toHaveText(ORDER_STATUSES.CANCELED);
    },
  );

  test(
    'Should close modal without cancelling order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickCancel();

      await confirmationModal.close();

      await expect(orderDetailsPage.cancelOrderButton, 'Cancel Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should NOT be CANCELED').not.toHaveText(
        ORDER_STATUSES.CANCELED,
      );
    },
  );

  test(
    'Should cancel modal without cancelling order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickCancel();

      await confirmationModal.cancel();

      await expect(orderDetailsPage.cancelOrderButton).toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should NOT be CANCELED').not.toHaveText(
        ORDER_STATUSES.CANCELED,
      );
    },
  );
});

test.describe('[UI] [Orders] [Integration] [Reopen modal]', async () => {
  let mockOrder: IOrderResponse;
  let updatedOrder: IOrderResponse;

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
        status: ORDER_STATUSES.CANCELED,
        delivery: null,
        _id: generateID(),
      },
      IsSuccess: true,
      ErrorMessage: null,
    };

    updatedOrder = {
      ...mockOrder,
      Order: {
        ...mockOrder.Order,
        status: ORDER_STATUSES.DRAFT,
      },
    };

    await mock.orderDetails(mockOrder);
    await orderDetailsPage.open(mockOrder.Order._id);
  });

  test(
    'Should successfully reopen order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      await orderDetailsPage.clickReopen();

      await mock.changeOrderStatus(updatedOrder);
      await mock.orderDetails(updatedOrder);

      await confirmationModal.submit();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_REOPEN);

      await expect(orderDetailsPage.cancelOrderButton, 'Cancel Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should NOT be CANCELED').not.toHaveText(
        ORDER_STATUSES.CANCELED,
      );
    },
  );

  test(
    'Should close modal without reopen order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickReopen();

      await confirmationModal.close();

      await expect(orderDetailsPage.reopenOrderButton, 'Reopen Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should be CANCELED').toHaveText(ORDER_STATUSES.CANCELED);
    },
  );

  test(
    'Should cancel modal without reopen order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickReopen();

      await confirmationModal.cancel();

      await expect(orderDetailsPage.reopenOrderButton, 'Reopen Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should be CANCELED').toHaveText(ORDER_STATUSES.CANCELED);
    },
  );
});

test.describe('[UI] [Orders] [Integration][Unassign Manager] ', async () => {
  let mockOrder: IOrderResponse;
  let updatedOrder: IOrderResponse;

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
        delivery: generateDeliveryData(),
        _id: generateID(),
      },
      IsSuccess: true,
      ErrorMessage: null,
    };
    updatedOrder = {
      ...mockOrder,
      Order: {
        ...mockOrder.Order,
        assignedManager: null,
      },
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
    'Should successfully unassign manager from order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      await orderDetailsPage.clickUnassignManager();
      await mock.unAssignManager(updatedOrder);
      await mock.orderDetails(updatedOrder);

      await confirmationModal.submit();
      await orderDetailsPage.waitForNotification(ALERTS.MANAGER_UNASSIGNED);

      await expect(orderDetailsPage.noAssignedManagerText, 'Verify no manager was assigned after closing').toHaveText(
        'Click to select manager',
      );
      await expect(
        orderDetailsPage.removeAssignedManagerButton,
        'Remove Assigned Manager button should NOT be visible',
      ).not.toBeVisible();
      await expect(
        orderDetailsPage.editAssignedManagerButton,
        'Edit Assigned Manager button should NOT be visible',
      ).not.toBeVisible();
    },
  );

  test(
    'Should close modal without unassign manager from order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickUnassignManager();

      await confirmationModal.close();

      const mockManagerName = `${mockManager.firstName} ${mockManager.lastName}`;
      await expect
        .soft(orderDetailsPage.assignedManagerName, 'Verify Manager name on orderDetailsPage')
        .toHaveText(mockManagerName);
      await expect(
        orderDetailsPage.removeAssignedManagerButton,
        'Remove Assigned Manager button should be visible',
      ).toBeVisible();
      await expect(
        orderDetailsPage.editAssignedManagerButton,
        'Edit Assigned Manager button should be visible',
      ).toBeVisible();
    },
  );

  test(
    'Should cancel modal without unassign manager from order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickUnassignManager();

      await confirmationModal.cancel();

      const mockManagerName = `${mockManager.firstName} ${mockManager.lastName}`;
      await expect
        .soft(orderDetailsPage.assignedManagerName, 'Verify Manager name on orderDetailsPage')
        .toHaveText(mockManagerName);
      await expect(
        orderDetailsPage.removeAssignedManagerButton,
        'Remove Assigned Manager button should be visible',
      ).toBeVisible();
      await expect(
        orderDetailsPage.editAssignedManagerButton,
        'Edit Assigned Manager button should be visible',
      ).toBeVisible();
    },
  );
});

test.describe('[UI] [Orders] [Integration][Process Order]', async () => {
  let mockOrder: IOrderResponse;
  let updatedOrder: IOrderResponse;

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
        delivery: generateDeliveryData(),
        _id: generateID(),
      },
      IsSuccess: true,
      ErrorMessage: null,
    };
    updatedOrder = {
      ...mockOrder,
      Order: {
        ...mockOrder.Order,
        status: ORDER_STATUSES.IN_PROCESS,
      },
    };

    await mock.orderDetails(mockOrder);
    await orderDetailsPage.open(mockOrder.Order._id);
  });

  test(
    'Should successfully process order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      await orderDetailsPage.clickProcess();

      await mock.changeOrderStatus(updatedOrder);
      await mock.orderDetails(updatedOrder);

      await confirmationModal.submit();

      await orderDetailsPage.waitForNotification(ALERTS.ORDER_PROCESS);
      await expect(orderDetailsPage.processOrderButton, 'Process Order button should NOT be visible').not.toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should be IN PROCESS').toHaveText(ORDER_STATUSES.IN_PROCESS);
    },
  );

  test(
    'Should close modal without processing order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickProcess();

      await confirmationModal.close();

      await expect(orderDetailsPage.processOrderButton, 'Process Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should be DRAFT').toHaveText(ORDER_STATUSES.DRAFT);
    },
  );

  test(
    'Should cancel modal without processing order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickProcess();

      await confirmationModal.cancel();

      await expect(orderDetailsPage.processOrderButton, 'Process Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should be DRAFT').toHaveText(ORDER_STATUSES.DRAFT);
    },
  );
});
