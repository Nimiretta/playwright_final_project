import { test as base } from 'fixtures/mock.fixture';
import { CustomersPage, HomePage, ProductsPage, SignInPage, OrderDetailsPage } from 'ui/pages';

interface ISalesPortalPages {
  signInPage: SignInPage;
  homePage: HomePage;
  customersPage: CustomersPage;
  productsPage: ProductsPage;
  orderDetailsPage: OrderDetailsPage;
}

export const test = base.extend<ISalesPortalPages>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  customersPage: async ({ page }, use) => {
    await use(new CustomersPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  orderDetailsPage: async ({ page }, use) => {
    await use(new OrderDetailsPage(page));
  },
});

export { expect } from '@playwright/test';
