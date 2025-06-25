import { expect } from '@playwright/test';
import { BaseProjectPage } from '../baseProjectPage';
import { logStep } from 'utils';

export abstract class Modal extends BaseProjectPage {
  @logStep('UI: Wait for Modal to be Closed')
  async waitForClosed() {
    await expect(this.uniqueElement).not.toBeVisible();
  }
}
