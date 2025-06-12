import { test as base } from '@playwright/test';
import { ProductsApiService, SignInApiService } from 'api/services';

interface IApiServices {
  signInApiService: SignInApiService;
  productsApiService: ProductsApiService;
}

export const test = base.extend<IApiServices>({
  signInApiService: async ({ request }, use) => {
    await use(new SignInApiService(request));
  },
  productsApiService: async ({ request }, use) => {
    await use(new ProductsApiService(request));
  },
});
