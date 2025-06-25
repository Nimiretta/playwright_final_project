import { expect } from '@playwright/test';
import { SalesPortalPage } from 'ui/pages/salePortal.page';
import { logStep } from 'utils';

export abstract class Modal extends SalesPortalPage {
  @logStep('UI: Wait for Modal to be Closed')
  async waitForClosed() {
    await expect(this.uniqueElement).not.toBeVisible();
  }
}
