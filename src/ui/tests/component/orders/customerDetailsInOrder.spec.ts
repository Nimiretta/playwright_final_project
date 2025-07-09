import { TAGS } from 'data';
import { orderInDefaultStatus } from 'data/orders/customerInOrderTest.data';
import { expect, test } from 'fixtures';

test.describe('[Integration] [Orders] [Customer Details]', () => {
  test(
    'Should open edit customer modal after clicking on the edit button',
    { tag: ['@005_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION, TAGS.COMPONENT] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickEditCustomerButton();
      await orderDetailsPage.editCustomerModal.waitForOpened();
    },
  );

  test(
    'Should display correct title in Customer Details card',
    { tag: ['@010_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION, TAGS.COMPONENT] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.customerDetailsTitle).toHaveText('Customer Details');
    },
  );
});
