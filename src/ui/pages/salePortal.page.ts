import { HeaderItem } from 'types';
import { BaseProjectPage } from './baseProjectPage';
import { logStep } from 'utils';
import { Locator } from '@playwright/test';

export abstract class SalesPortalPage extends BaseProjectPage {
  readonly uniqueElement = this.page.locator('#main-header');

  readonly homeNavButton = this.page.getByRole('link', { name: 'Home' });
  readonly ordersNavButton = this.page.getByRole('link', { name: 'Orders' });
  readonly customersNavButton = this.page.getByRole('link', { name: 'Customers' });
  readonly productsNavButton = this.page.getByRole('link', { name: 'Products' });
  readonly managersNavButton = this.page.getByRole('link', { name: 'Managers' });

  @logStep('Click on Header item ')
  async clickNavigationButton(headerItem: HeaderItem) {
    const headerButtons: Record<HeaderItem, Locator> = {
      Home: this.homeNavButton,
      Orders: this.ordersNavButton,
      Customers: this.customersNavButton,
      Products: this.productsNavButton,
      Managers: this.managersNavButton,
    };

    await headerButtons[headerItem].click();
  }
}
