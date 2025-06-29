import { BaseProjectPage } from 'ui/pages';

export abstract class OrderTab extends BaseProjectPage {
  readonly tabContainer = this.page.locator('#order-details-tabs-content');
  readonly title = this.tabContainer.locator('h4');
}
