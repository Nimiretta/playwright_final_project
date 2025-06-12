import { APIRequestContext } from '@playwright/test';
import { RequestApi } from 'api/apiClients/request';

export class OrdersController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }
}
