import { TAGS } from 'data';
import { test, expect } from 'fixtures';
import { ICustomerFromResponse, IOrderFromResponse } from 'types';
import { convertToUIData } from 'utils';

test.describe('[E2E] [UI] [Orders] [Update Customer In Order]', () => {
  let token = '';
  let order: IOrderFromResponse;
  let customer: ICustomerFromResponse;
  test.beforeEach(async ({ signInApiService, customersApiService }) => {
    token = await signInApiService.getAuthToken();
    customer = await customersApiService.create(token);
  });
  test.afterEach(async ({ ordersApiService, customersApiService }) => {
    await ordersApiService.clear(token);
    await customersApiService.delete(customer._id, token);
  });
  test(
    'Sould update customer if order is in Draft status',
    { tag: ['@001_O_E2E_UC', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickEditCustomerButton();
      await orderDetailsPage.editCustomerModal.waitForOpened();
      await orderDetailsPage.editCustomerModal.selectCustomer(customer.name);
      await orderDetailsPage.editCustomerModal.clickSaveButton();
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.notification).toHaveText('Order was successfully updated');
      expect.soft(await orderDetailsPage.getCustomer()).toMatchObject(convertToUIData(customer));
    },
  );

  test(
    'Should not update customer if order is in In Process status',
    { tag: ['@002_O_E2E_UC', TAGS.E2E] },
    async ({ orderDetailsPage, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.editCutomerButton).not.toBeVisible();
    },
  );
  test(
    'Should not update customer if order is in Canceled status',
    { tag: ['@003_O_E2E_UC', TAGS.E2E] },
    async ({ orderDetailsPage, ordersApiService }) => {
      order = await ordersApiService.createCanceled(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.editCutomerButton).not.toBeVisible();
    },
  );
  test(
    'Should not update customer if order is in Partially Received status',
    { tag: ['@004_O_E2E_UC', TAGS.E2E] },
    async ({ orderDetailsPage, ordersApiService }) => {
      order = await ordersApiService.createPartiallyReceived(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.editCutomerButton).not.toBeVisible();
    },
  );

  test(
    'Should not update customer if order is in Received status',
    { tag: ['@005_O_E2E_UC', TAGS.E2E] },
    async ({ orderDetailsPage, ordersApiService }) => {
      order = await ordersApiService.createReceived(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.editCutomerButton).not.toBeVisible();
    },
  );
});
