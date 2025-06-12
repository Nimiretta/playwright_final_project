import { test as base } from '@playwright/test';
import { OrdersApiService, SignInApiService } from 'api/services';

interface IApiServices {
  signInApiService: SignInApiService;
  ordersApiService: OrdersApiService;
}

export const test = base.extend<IApiServices>({
  signInApiService: async ({ request }, use) => {
    await use(new SignInApiService(request));
  },

  ordersApiService: async ({ request }, use) => {
    await use(new OrdersApiService(request));
  },
});
