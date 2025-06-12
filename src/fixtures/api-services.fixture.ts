import { test as base } from '@playwright/test';
import { ProductsApiService, OrdersApiService, SignInApiService } from 'api/services';

interface IApiServices {
  signInApiService: SignInApiService;
  ordersApiService: OrdersApiService;
  productsApiService: ProductsApiService;
}

export const test = base.extend<IApiServices>({
  signInApiService: async ({ request }, use) => {
    await use(new SignInApiService(request));
  },

  productsApiService: async ({ request }, use) => {
    await use(new ProductsApiService(request));
  },

  ordersApiService: async ({ request }, use) => {
    await use(new OrdersApiService(request));
  },
});
