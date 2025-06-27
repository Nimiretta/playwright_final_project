import { expect } from '@playwright/test';
import { logStep } from 'utils';
import { Modal } from '../modal.page';

export class AssignManagerModal extends Modal {
  readonly confirmButton = this.modalContainer.locator('#update-manager-btn');
  readonly cancelButton = this.modalContainer.locator('#cancel-edit-manager-modal-btn');
  readonly managerList = this.modalContainer.locator('#manager-list');
  uniqueElement = this.modalContainer;

  @logStep('UI: Select manager on AssignManagerModal')
  async select(managerId: string) {
    await expect(this.managerList).toBeVisible();
    const managerItem = this.managerList.locator(`li[data-managerid="${managerId}"]`);
    await managerItem.click();
    await expect(managerItem).toHaveClass(/active/);
  }

  @logStep('UI: Click SubmitButton on AssignManagerModal')
  async submit() {
    await this.confirmButton.click();
    await this.waitForClosed();
  }

  @logStep('UI: Click CancelButton on AssignManagerModal')
  async cancel() {
    await this.cancelButton.click();
    await this.waitForClosed();
  }
}
