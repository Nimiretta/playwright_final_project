import { expect } from '@playwright/test';
import { logStep } from 'utils';
import { Modal } from '../modal.page';

export class AssignManagerModal extends Modal {
  readonly confirmButton = this.modalContainer.locator('#update-manager-btn');
  readonly cancelButton = this.modalContainer.locator('#cancel-edit-manager-modal-btn');
  readonly managerList = this.modalContainer.locator('#manager-list');
  readonly searchInput = this.modalContainer.locator('#manager-search-input');
  uniqueElement = this.modalContainer;

  @logStep('Select manager on AssignManagerModal')
  async select(managerId: string) {
    await expect(this.managerList).toBeVisible();
    const managerItem = this.managerList.locator(`li[data-managerid="${managerId}"]`);
    await managerItem.click();
    await expect(managerItem).toHaveClass(/active/);
  }

  @logStep('Click SubmitButton on AssignManagerModal')
  async submit() {
    await this.confirmButton.click();
    await this.waitForClosed();
  }

  @logStep('Select manager from Search Field on AssignManagerModal')
  async search(value: string) {
    await this.searchInput.fill(value);
    const managerItem = this.managerList.locator('li.list-group-item', { hasText: value }).first();
    await expect(managerItem).toBeVisible();
    await managerItem.click();
    await expect(managerItem).toHaveClass(/active/);
  }

  @logStep('Get manager info on AssignManagerModal')
  async getManager(managerId: string) {
    await expect(this.managerList).toBeVisible();
    const managerItem = this.managerList.locator(`li[data-managerid="${managerId}"]`);
    const info = await managerItem.innerText();
    return info.trim();
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
