import { APIRequestContext } from '@playwright/test';
import { SignInController } from 'api/controllers';
import { USER_LOGIN, USER_PASSWORD } from 'config';
import { STATUS_CODES } from 'data';
import { logStep } from 'utils';
import { validateResponse } from 'utils/validations';
import { Page } from '@playwright/test';

export class SignInApiService {
  controller: SignInController;
  constructor(request: APIRequestContext) {
    this.controller = new SignInController(request);
  }

  @logStep('Login and get token via API')
  async loginAsLocalUser() {
    const response = await this.controller.login({
      username: USER_LOGIN,
      password: USER_PASSWORD,
    });

    validateResponse(response, STATUS_CODES.OK, true, null);
    const token = response.headers['authorization'];
    return token;
  }

  async getAuthToken(page: Page) {
    return (await page.context().cookies()).find((c) => c.name === 'Authorization')!.value;
  }
}
