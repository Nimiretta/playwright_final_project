import { apiConfig } from 'config';
import { TAGS } from 'data';
import { convertCustomerToUIData } from 'data/orders';
import { customerDetails, orderInDefaultStatus, orderWithDifferentStatuses } from 'data/orders/testData';
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
    'Should send correct request after clicking customer order',
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
});
