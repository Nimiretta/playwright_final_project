import { test as base } from '@playwright/test';
import { CustomersController, ProductsController, SignInController } from 'api/controllers';

interface IControllers {
  productsController: ProductsController;
  signInController: SignInController;
  customersController: CustomersController;
}

export const test = base.extend<IControllers>({
  productsController: async ({ request }, use) => {
    await use(new ProductsController(request));
  },
  signInController: async ({ request }, use) => {
    await use(new SignInController(request));
  },
  customersController: async ({ request }, use) => {
    await use(new CustomersController(request));
  },
});
