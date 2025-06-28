import { test } from '@playwright/test';
import { USER_ID } from 'config';
import { OrderDetailsPage } from 'ui/pages/orders/orderDetails.page';

test('test', async ({ page }) => {
  const orderDetailsPage = new OrderDetailsPage(page);

  await orderDetailsPage.open('685cec831c508c5d5e68517b');

  //   const val = await orderDetailsPage.getOrderValues(); // пример кнопки, откроет модалку
  //   console.log(val)
  await orderDetailsPage.clickProcess();
  await orderDetailsPage.processModal.cancel();
  await orderDetailsPage.clickAddAssignManager();
  await orderDetailsPage.assignManagerModal.select(USER_ID);
  await orderDetailsPage.assignManagerModal.submit();
  await orderDetailsPage.clickUnassignManager();
  await orderDetailsPage.unassignModal.submit();
  // await orderDetailsPage.assignManagerModal.cancel();
});
