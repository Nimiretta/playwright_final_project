import { APIRequestContext } from '@playwright/test';
import { OrdersController } from 'api/controllers';

export class OrdersApiService {
  private controller: OrdersController;

  constructor(request: APIRequestContext) {
    this.controller = new OrdersController(request);
  }
}
