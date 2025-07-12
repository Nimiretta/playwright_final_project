import { ALERTS, TAGS } from 'data';
import { generateMockOrder, mockManager } from 'data/orders/mock.data';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';

test.describe('[UI] [Orders] [Integration] Assign New Manager Modal', async () => {
  let mockOrder: IOrderResponse;
  let updatedOrder: IOrderResponse;

  test.beforeEach(async ({ orderDetailsPage, mock }) => {
    mockOrder = generateMockOrder();

    updatedOrder = {
      ...mockOrder,
      Order: {
        ...mockOrder.Order,
        assignedManager: mockManager,
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
    'Assign a New Manager',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, assignManagerModal, mock }) => {
      await orderDetailsPage.clickAddAssignManager();

      await assignManagerModal.select(mockManager._id);

      const managerInfo = await assignManagerModal.getManager(mockManager._id);

      const mockinfo = `${mockManager.firstName} ${mockManager.lastName} (${mockManager.username})`;

      expect.soft(managerInfo, 'Selected manager info should match mocked manager').toBe(mockinfo);

      await mock.assignManager(updatedOrder);
      await mock.orderDetails(updatedOrder);

      await assignManagerModal.submit();

      const mockManagerName = `${mockManager.firstName} ${mockManager.lastName}`;
      await expect
        .soft(orderDetailsPage.assignedManagerName, 'Verify Manager name on orderDetailsPage')
        .toHaveText(mockManagerName);
      await orderDetailsPage.waitForNotification(ALERTS.MANAGER_ASSIGNED);
    },
  );

  test(
    'Should not assign manager when modal is closed',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickAddAssignManager();

      await assignManagerModal.close();

      await expect(orderDetailsPage.noAssignedManagerText, 'Verify no manager was assigned after closing').toHaveText(
        'Click to select manager',
      );
    },
  );

  test(
    'Should not assign manager when modal is canceled',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickAddAssignManager();

      await assignManagerModal.cancel();

      await expect(orderDetailsPage.noAssignedManagerText, 'Verify no manager was assigned after closing').toHaveText(
        'Click to select manager',
      );
    },
  );
});
