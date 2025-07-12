import { TAGS } from 'data';
import { generateCustomerData } from 'data/customers';
import { generateDeliveryData, ORDER_STATUSES } from 'data/orders';
import { mockManager } from 'data/orders/mock.data';
import { modalDescription, modalTitle } from 'data/orders/modalText.data';
import { generateProductData } from 'data/products';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';
import { generateID } from 'utils';

test.describe('[UI] [Orders] [Component] Confirmation Modals', async () => {
  let mockOrder: IOrderResponse;

  test(
    '[Cancel modal] Should display all buttons & title modal',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.COMPONENT] },
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
