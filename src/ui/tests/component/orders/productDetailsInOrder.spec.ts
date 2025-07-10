import { expect, test } from 'fixtures';

test.describe('[COMPONENT] [ORDETS] [Product Details]', () => {
  test('Product Details should be colapsed after openning the page', async ({
    orderDetailsPage,
    ordersApiService,
    signInApiService,
  }) => {
    const token = await signInApiService.getAuthToken();
    const order = await ordersApiService.createDraft(token);
    await orderDetailsPage.open(order._id);
    expect(orderDetailsPage.expandProductDetailsArrow).toHaveAttribute('aria-expanded', 'false');
  });

  test('Product Details should be expanded after clicking on the arror', async ({
    orderDetailsPage,
    ordersApiService,
    signInApiService,
  }) => {
    const token = await signInApiService.getAuthToken();
    const order = await ordersApiService.createDraft(token);
    await orderDetailsPage.open(order._id);
    await orderDetailsPage.expandProductDetailsArrow.click();
    expect(orderDetailsPage.expandProductDetailsArrow).toHaveAttribute('aria-expanded', 'true');
  });

  test('Should display correct title for Product details section', async ({
    orderDetailsPage,
    ordersApiService,
    signInApiService,
  }) => {
    const token = await signInApiService.getAuthToken();
    const order = await ordersApiService.createDraft(token);
    await orderDetailsPage.open(order._id);
    expect(orderDetailsPage.productDetailsTitle).toHaveText('Requested Products');
  });

  test('Should open Products Modal after clicking on the edit button', async ({
    orderDetailsPage,
    ordersApiService,
    signInApiService,
  }) => {
    const token = await signInApiService.getAuthToken();
    const order = await ordersApiService.createDraft(token);
    await orderDetailsPage.open(order._id);
    await orderDetailsPage.editProductsButton.click();
    await orderDetailsPage.editProductsModal.waitForOpened();
  });
});
