import { apiConfig } from 'config';
import { NOTIFICATIONS, TAGS } from 'data';
import { convertCustomerToUIData } from 'data/orders';
import {
  customerDetails,
  getAllCustomersResponselist,
  errorResponseForCustomerDetailsInOrder,
  orderInDefaultStatus,
  orderWithDifferentStatuses,
  errorResponseForUpdateCustomer,
} from 'data/orders/testData';
import { expect, test } from 'fixtures';

test.describe('[Integration] [Orders] [Customer Details]', () => {
  customerDetails.forEach((el) =>
    test(el.testName, { tag: el.tag }, async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(el.response);
      await orderDetailsPage.open(el.response.Order._id);
      await orderDetailsPage.waitForOpened();
      const customer = await orderDetailsPage.getCustomer();
      expect(convertCustomerToUIData(el.response.Order.customer)).toMatchObject(customer);
    }),
  );

  test(
    'Should display edit button if order is in Draft status',
    { tag: ['@003_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.editCutomerButton).toBeVisible();
    },
  );

  orderWithDifferentStatuses.forEach((el) => {
    test(el.testName, { tag: el.tag }, async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(el.response);
      await orderDetailsPage.open(el.response.Order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.editCutomerButton).not.toBeVisible();
    });
  });

  test(
    'Should send correct request after clicking edit customer in order (getAllCustomers)',
    { tag: ['@009_O_CM_UI', TAGS.INTEGRATION] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      const request = await orderDetailsPage.interceptRequest(apiConfig.ENDPOINTS.CUSTOMERS_ALL, () =>
        orderDetailsPage.clickEditCustomerButton(),
      );
      expect(request.url()).toBe(apiConfig.BASE_URL + apiConfig.ENDPOINTS.CUSTOMERS_ALL);
    },
  );

  errorResponseForCustomerDetailsInOrder.forEach((el) => {
    test(el.testName, { tag: el.tag }, async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      await mock.allCustomersWithError(el.Response, el.statusCode);
      await orderDetailsPage.editCutomerButton.click();
      await orderDetailsPage.waitForNotification(NOTIFICATIONS.UPDATE_CUSTOMRE_IS_UNABLE);
    });
  });

  test(
    'Should update Customer Details after updating customer',
    { tag: ['@013_O_CM_UI', TAGS.INTEGRATION] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      await mock.allCustomers(getAllCustomersResponselist);
      await orderDetailsPage.clickEditCustomerButton();
      await orderDetailsPage.editCustomerModal.selectCustomer(getAllCustomersResponselist.Customers[1].name);
      const UpdatedOrder = structuredClone(orderInDefaultStatus);
      UpdatedOrder.Order.customer = getAllCustomersResponselist.Customers[1];
      await mock.orderDetails(UpdatedOrder);
      await orderDetailsPage.editCustomerModal.clickSaveButton();
      await orderDetailsPage.waitForOpened();
      expect(convertCustomerToUIData(UpdatedOrder.Order.customer)).toMatchObject(await orderDetailsPage.getCustomer());
    },
  );

  test(
    'Should display notification after successful update',
    { tag: ['@014_O_CM_UI', TAGS.INTEGRATION] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      await mock.allCustomers(getAllCustomersResponselist);
      await orderDetailsPage.clickEditCustomerButton();
      await orderDetailsPage.editCustomerModal.selectCustomer(getAllCustomersResponselist.Customers[1].name);
      const UpdatedOrder = structuredClone(orderInDefaultStatus);
      UpdatedOrder.Order.customer = getAllCustomersResponselist.Customers[1];
      await mock.orderDetails(UpdatedOrder);
      await orderDetailsPage.editCustomerModal.clickSaveButton();
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.waitForNotification(NOTIFICATIONS.ORDER_UPDATED);
    },
  );

  errorResponseForUpdateCustomer.forEach((el) => {
    test(el.testName, { tag: el.tag }, async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      await mock.allCustomers(getAllCustomersResponselist);
      await orderDetailsPage.clickEditCustomerButton();
      await orderDetailsPage.editCustomerModal.selectCustomer(getAllCustomersResponselist.Customers[1].name);
      await mock.orderDetailsWithError(orderInDefaultStatus, el.response, el.statusCode);
      await orderDetailsPage.editCustomerModal.clickSaveButton();
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.waitForNotification(NOTIFICATIONS.UPDATE_CUSTOMER_FAILED);
    });
  });

  test(
    'Should send correct request after clicking edit customer in order (getOrderByID)',
    { tag: ['@017_O_CM_UI', TAGS.INTEGRATION] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      const request = await orderDetailsPage.interceptRequest(apiConfig.ENDPOINTS.CUSTOMERS_ALL, () =>
        orderDetailsPage.clickEditCustomerButton(),
      );
      expect(request.url()).toBe(apiConfig.BASE_URL + apiConfig.ENDPOINTS.ORDERS_BY_ID(orderInDefaultStatus.Order._id));
    },
  );
});
