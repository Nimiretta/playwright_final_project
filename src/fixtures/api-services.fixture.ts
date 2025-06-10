import { test as base } from '@playwright/test';
import { SignInApiService } from 'api/services';

interface IApiServices {
  signInApiService: SignInApiService;
}

export const test = base.extend<IApiServices>({
  signInApiService: async ({ request }, use) => {
    await use(new SignInApiService(request));
  },
});
