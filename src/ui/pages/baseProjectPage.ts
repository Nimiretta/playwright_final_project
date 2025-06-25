import { expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { logStep } from 'utils';

export abstract class BaseProjectPage extends BasePage {
  abstract uniqueElement: Locator;

  readonly spinner = this.page.locator('.spinner-border');
  readonly notification = this.page.locator('.toast-body');

  @logStep('UI: Wait for Page to Open')
  async waitForOpened() {
    await expect(this.uniqueElement).toBeVisible();
    await this.waitForSpinner();
  }

  @logStep('UI: Wait for Spinner to Disappear')
  async waitForSpinner() {
    await expect(this.spinner).toHaveCount(0);
  }

  @logStep('UI: Wait for Notification to Appear')
  async waitForNotification(text: string) {
    await expect(this.notification.last()).toHaveText(text);
  }
}
