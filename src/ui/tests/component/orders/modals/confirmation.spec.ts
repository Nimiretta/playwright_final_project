import { TAGS } from 'data';
import {
  generateDeliveryData,
  ORDER_STATUSES,
  modalDescription,
  modalTitle,
  mockManager,
  generateMockOrder,
} from 'data/orders';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';

test.describe('[UI] [Orders] [Component] Confirmation Modals', async () => {
  let mockOrder: IOrderResponse;

  test(
    '[Cancel modal] Should display all buttons & title modal',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.COMPONENT] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      mockOrder = generateMockOrder();

      await mock.orderDetails(mockOrder);
      await orderDetailsPage.open(mockOrder.Order._id);

      await orderDetailsPage.clickCancel();

      await expect.soft(confirmationModal.title).toContainText(modalTitle.cancelOrder);
      await expect.soft(confirmationModal.description).toContainText(modalDescription.cancelOrder);
      await expect.soft(confirmationModal.confirmButton).toBeVisible();
      await expect.soft(confirmationModal.confirmButton).toBeEnabled();
      await expect.soft(confirmationModal.cancelButton).toBeVisible();
      await expect.soft(confirmationModal.cancelButton).toBeEnabled();
      await expect.soft(confirmationModal.closeButton).toBeVisible();
      await expect.soft(confirmationModal.closeButton).toBeEnabled();
    },
  );
  test(
    '[Reopen modal] Should display all buttons & title modal',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.COMPONENT] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      mockOrder = generateMockOrder({ status: ORDER_STATUSES.CANCELED });

      await mock.orderDetails(mockOrder);
      await orderDetailsPage.open(mockOrder.Order._id);
      await orderDetailsPage.clickReopen();

      await expect.soft(confirmationModal.title).toContainText(modalTitle.reopenOrder);
      await expect.soft(confirmationModal.description).toContainText(modalDescription.reopenOrder);
      await expect.soft(confirmationModal.confirmButton).toBeVisible();
      await expect.soft(confirmationModal.confirmButton).toBeEnabled();
      await expect.soft(confirmationModal.cancelButton).toBeVisible();
      await expect.soft(confirmationModal.cancelButton).toBeEnabled();
      await expect.soft(confirmationModal.closeButton).toBeVisible();
      await expect.soft(confirmationModal.closeButton).toBeEnabled();
    },
  );

  test(
    '[Unassign Manager] Should display all buttons & title modal',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.COMPONENT] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      mockOrder = generateMockOrder({ assignedManager: mockManager });

      await mock.users({
        Users: [mockManager],
        IsSuccess: true,
        ErrorMessage: null,
      });

      await mock.orderDetails(mockOrder);
      await orderDetailsPage.open(mockOrder.Order._id);
      await orderDetailsPage.clickUnassignManager();

      await expect.soft(confirmationModal.title).toContainText(modalTitle.unassignManager);
      await expect.soft(confirmationModal.description).toContainText(modalDescription.unassignManager);
      await expect.soft(confirmationModal.confirmButton).toBeVisible();
      await expect.soft(confirmationModal.confirmButton).toBeEnabled();
      await expect.soft(confirmationModal.cancelButton).toBeVisible();
      await expect.soft(confirmationModal.cancelButton).toBeEnabled();
      await expect.soft(confirmationModal.closeButton).toBeVisible();
      await expect.soft(confirmationModal.closeButton).toBeEnabled();
    },
  );

  test(
    '[Process Order] Should display all buttons & title modal',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.COMPONENT] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      mockOrder = generateMockOrder({ delivery: generateDeliveryData() });

      await mock.orderDetails(mockOrder);
      await orderDetailsPage.open(mockOrder.Order._id);
      await orderDetailsPage.clickProcess();

      await expect.soft(confirmationModal.title).toContainText(modalTitle.processOrder);
      await expect.soft(confirmationModal.description).toContainText(modalDescription.processOrder);
      await expect.soft(confirmationModal.confirmButton).toBeVisible();
      await expect.soft(confirmationModal.confirmButton).toBeEnabled();
      await expect.soft(confirmationModal.cancelButton).toBeVisible();
      await expect.soft(confirmationModal.cancelButton).toBeEnabled();
      await expect.soft(confirmationModal.closeButton).toBeVisible();
      await expect.soft(confirmationModal.closeButton).toBeEnabled();
    },
  );
});
