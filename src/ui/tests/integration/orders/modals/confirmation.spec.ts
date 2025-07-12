import { ALERTS, TAGS } from 'data';
import { generateCustomerData } from 'data/customers';
import { generateDeliveryData, ORDER_STATUSES, mockManager } from 'data/orders';
import { generateProductData } from 'data/products';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';
import { generateID } from 'utils';

test.describe('[UI] [Orders] [Integration] Confirmation Modals', async () => {
  let mockOrder: IOrderResponse;
  let updatedOrder: IOrderResponse;

  test(
    '[Cancel modal] Should succesfull cancel order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
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
          status: ORDER_STATUSES.CANCELED,
        },
      };

      await mock.orderDetails(mockOrder);
      await orderDetailsPage.open(mockOrder.Order._id);

      await orderDetailsPage.clickCancel();

      await mock.changeOrderStatus(updatedOrder);
      await mock.orderDetails(updatedOrder);

      await confirmationModal.submit();

      await orderDetailsPage.waitForNotification(ALERTS.ORDER_CANCELED);
      await expect(orderDetailsPage.reopenOrderButton).toBeVisible();
    },
  );
  test(
    '[Reopen modal] Should succesfull reopen order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
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
          status: ORDER_STATUSES.DRAFT,
        },
      };

      await mock.orderDetails(mockOrder);
      await orderDetailsPage.open(mockOrder.Order._id);
      await orderDetailsPage.clickReopen();

      await mock.changeOrderStatus(updatedOrder);
      await mock.orderDetails(updatedOrder);

      await confirmationModal.submit();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_REOPEN);
      await expect(orderDetailsPage.cancelOrderButton).toBeVisible();
    },
  );

  test(
    '[Unassign Manager] Should succesfull unassign manager from order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
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
      await orderDetailsPage.clickUnassignManager();
      await mock.unAssignManager(updatedOrder);
      await mock.orderDetails(updatedOrder);

      await confirmationModal.submit();
      await orderDetailsPage.waitForNotification(ALERTS.MANAGER_UNASSIGNED);

      await expect(orderDetailsPage.noAssignedManagerText, 'Verify no manager was assigned after closing').toHaveText(
        'Click to select manager',
      );
      await expect(orderDetailsPage.removeAssignedManagerButton).not.toBeVisible();
      await expect(orderDetailsPage.editAssignedManagerButton).not.toBeVisible();
    },
  );

  test(
    '[Process Order] Should succesfull process order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
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
      await orderDetailsPage.clickProcess();

      await mock.changeOrderStatus(updatedOrder);
      await mock.orderDetails(updatedOrder);

      await confirmationModal.submit();

      await orderDetailsPage.waitForNotification(ALERTS.ORDER_PROCESS);
      await expect(orderDetailsPage.processOrderButton).not.toBeVisible();
      await expect(orderDetailsPage.status).toHaveText(ORDER_STATUSES.IN_PROCESS);
    },
  );
});
