import { expect } from '@playwright/test';
import { BaseProjectPage } from '../baseProjectPage';
import { logStep } from 'utils';

export abstract class Modal extends BaseProjectPage {
  readonly modalContainer = this.page.locator(`div[role="dialog"]`);
  readonly title = this.modalContainer.locator('.modal-title');
  readonly closeButton = this.modalContainer.locator('button[aria-label="Close"]');

  @logStep('Click on modal close button')
  async close() {
    await this.closeButton.click();
    await this.waitForClosed();
  }

  @logStep('UI: Wait for Modal to be Closed')
  async waitForClosed() {
    await expect(this.uniqueElement).not.toBeVisible();
  }
}
