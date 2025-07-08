import { expect } from 'fixtures';
import { Modal } from '../modal.page';
import { logStep } from 'utils';

export class ConfirmationModal extends Modal {
  readonly description = this.modalContainer.locator('p');
  readonly confirmButton = this.modalContainer.locator('button[type="submit"]');
  readonly cancelButton = this.modalContainer.locator('button.btn-secondary');
  uniqueElement = this.modalContainer;

  @logStep('Click SubmitButton')
  async submit() {
    await this.confirmButton.click();
    await this.waitForClosed();
  }

  @logStep('Check UI element')
  async checkCommonUI(titleText: string) {
    await expect.soft(this.title).toContainText(titleText);
    await expect.soft(this.confirmButton).toBeVisible();
    await expect.soft(this.confirmButton).toBeEnabled();
    await expect.soft(this.cancelButton).toBeVisible();
    await expect.soft(this.cancelButton).toBeEnabled();
    await expect.soft(this.closeButton).toBeVisible();
    await expect.soft(this.closeButton).toBeEnabled();
  }
}
