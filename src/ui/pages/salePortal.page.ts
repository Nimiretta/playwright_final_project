import { HeaderItem } from 'types';
import { BaseProjectPage } from './baseProjectPage';
import { logStep } from 'utils';
import { Locator } from '@playwright/test';
import { ROUTES } from 'config/routes';

export abstract class SalesPortalPage extends BaseProjectPage {
  readonly uniqueElement = this.page.locator('#main-header');

  readonly homeNavButton = this.page.getByRole('link', { name: 'Home' });
  readonly ordersNavButton = this.page.getByRole('link', { name: 'Orders' });
  readonly customersNavButton = this.page.getByRole('link', { name: 'Customers' });
  readonly productsNavButton = this.page.getByRole('link', { name: 'Products' });
  readonly managersNavButton = this.page.getByRole('link', { name: 'Managers' });

  @logStep('Open Page by route')
  async openPage(page: keyof typeof ROUTES, id?: string) {
    const route = ROUTES[page];
    if (typeof route === 'string') {
      await this.page.goto(route);
    } else {
      if (!id) throw new Error('Id was not provided');
      await this.page.goto(route(id));
    }
  }

  @logStep('Click on Header item ')
  async clickHeaderButton(headerItem: HeaderItem) {
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
