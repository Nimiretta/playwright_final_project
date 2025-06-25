import { expect } from '@playwright/test';
import { logStep } from 'utils';
import { ConfirmationModal } from './confirmation.modal';

export class AssignManagerModal extends ConfirmationModal {
  readonly managerList = this.uniqueElement.locator('#manager-list');

  @logStep('UI: Select manager on AssignManagerModal')
  async select(managerId: string) {
    const managerItem = this.managerList.locator(`li[data-managerid="${managerId}"]`);
    await managerItem.click();
    await expect(managerItem).toHaveClass(/active/);
  }
}
