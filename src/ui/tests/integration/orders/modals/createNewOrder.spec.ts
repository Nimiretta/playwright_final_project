import { TAGS } from 'data';
import { mockCustomer, mockProduct } from 'data/orders/mock.data';
import { expect, test } from 'fixtures';

test.describe(`[UI] [Orders] New Order modal`, async function () {
  let token = '';

  test.beforeEach(async ({ signInApiService, ordersPage, mock }) => {
    token = await signInApiService.getAuthToken();
    await ordersPage.open();
    await ordersPage.waitForOpened();
    await mock.createOrder({
      customers: { Customers: [mockCustomer], IsSuccess: true, ErrorMessage: null },
      products: { Products: [mockProduct], IsSuccess: true, ErrorMessage: null },
    });
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Create Order Smoke test with 1 product',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE] },
    async function ({ ordersPage, createOrderModal }) {
      await ordersPage.clickCreateButton();

      await createOrderModal.selectCustomer(mockCustomer.name);
      await createOrderModal.selectProduct(mockProduct.name);

      const totalPrice = await createOrderModal.getTotalPrice();
      expect.soft(totalPrice).toBe(mockProduct.price);
      const nameCustomer = await createOrderModal.getCustomersInDropdown();
      expect.soft(nameCustomer[0]).toBe(mockCustomer.name);
      const nameProduct = await createOrderModal.getProductsInDropdown();
      expect.soft(nameProduct[0]).toBe(mockProduct.name);

      await expect.soft(createOrderModal.title).toContainText('Create Order');
      await expect.soft(createOrderModal.createButton).toBeVisible();
      await expect.soft(createOrderModal.createButton).toBeEnabled();
      await expect.soft(createOrderModal.cancelButton).toBeVisible();
      await expect.soft(createOrderModal.cancelButton).toBeEnabled();
      await expect.soft(createOrderModal.closeButton).toBeVisible();
      await expect.soft(createOrderModal.closeButton).toBeEnabled();

      await createOrderModal.clickCreate();
      await createOrderModal.waitForClosed();
    },
  );

  test(
    'Create Order Smoke test with 5 product',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE] },
    async function ({ ordersPage, createOrderModal }) {
      await ordersPage.clickCreateButton();

      await createOrderModal.selectCustomer(mockCustomer.name);
      await createOrderModal.selectProduct(mockProduct.name);

      await expect(createOrderModal.deleteProductButton.nth(0)).not.toBeVisible();
      for (let i = 1; i <= 4; i++) {
        await createOrderModal.clickAddProduct();
        await createOrderModal.selectProduct(mockProduct.name);
        await expect(createOrderModal.deleteProductButton.nth(i)).toBeVisible();
      }

      await createOrderModal.clickDeleteProductButton(4);
      await createOrderModal.clickAddProduct();
      await createOrderModal.selectProduct(mockProduct.name);
      await expect(createOrderModal.deleteProductButton.nth(4)).toBeVisible();

      const totalPrice = await createOrderModal.getTotalPrice();
      expect.soft(totalPrice).toBe(mockProduct.price * 5);

      await expect(createOrderModal.addProductButton).not.toBeVisible();

      await createOrderModal.clickCreate();
      await createOrderModal.waitForClosed();
    },
  );
});
