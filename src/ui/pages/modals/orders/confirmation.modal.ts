import { Modal } from '../modal.pages';
import { logStep } from 'utils';

export class ConfirmationModal extends Modal {
  uniqueElement = this.page.locator(`.modal-dialog`);
  description = this.uniqueElement.locator('p');
  confirmButton = this.uniqueElement.locator(`button[type="submit"]`);
  cancelButton = this.uniqueElement.locator('button.btn-secondary');

  @logStep('UI: Click SubmitButton')
  async submit() {
    await this.confirmButton.click();
    await this.waitForClosed();
  }

  @logStep('UI: Click CancelButton')
  async cancel() {
    await this.cancelButton.click();
    await this.waitForClosed();
  }
}
