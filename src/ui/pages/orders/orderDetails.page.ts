import { logStep } from 'utils';
import { SalesPortalPage } from '../salePortal.page';
import { AssignManagerModal } from '../modals/orders/assignManager.modal';
import { ConfirmationModal } from '../modals/orders/confirmation.modal';
import { DeliveryTab } from './tabs/delivery.tab';

export class OrderDetailsPage extends SalesPortalPage {
  //modals
  readonly confirmationModal = new ConfirmationModal(this.page);
  readonly assignManagerModal = new AssignManagerModal(this.page);
  readonly processModal = this.confirmationModal;
  readonly cancelModal = this.confirmationModal;
  readonly reopenModal = this.confirmationModal;
  readonly unassignModal = this.confirmationModal;

  uniqueElement = this.page.locator('#order-details-body');

  readonly title = this.page.locator('h2');
  readonly orderInfoContainer = this.page.locator('#order-info-container');
  readonly orderNumber = this.orderInfoContainer.locator('span.fst-italic').first();
  readonly assignedManagerName = this.orderInfoContainer.locator('#assigned-manager-link');
  readonly editAssignedManagerButton = this.orderInfoContainer.getByTitle('Edit Assigned Manager');
  readonly removeAssignedManagerButton = this.orderInfoContainer.getByTitle('Remove Assigned Manager');
  readonly noAssignedManagerText = this.orderInfoContainer.getByText('Click to select manager');
  readonly refreshOrderButton = this.page.locator('#refresh-order');
  readonly cancelOrderButton = this.page.locator('#cancel-order');
  readonly reopenOrderButton = this.page.locator('#reopen-order');
  readonly processOrderButton = this.page.locator('#process-order');

  readonly orderValuesContainer = this.orderInfoContainer.locator('div.h-m-width');
  readonly orderValues = this.orderValuesContainer.locator('span:not(.fw-bold)');
  readonly status = this.orderValues.nth(0);
  readonly totalPrice = this.orderValues.nth(1);
  readonly deliveryDate = this.orderValues.nth(2);
  readonly createdOn = this.orderValues.nth(3);

  //tabs
  readonly deliveryTab = new DeliveryTab(this.page);
  readonly deliveryTabButton = this.page.locator('#delivery-tab');
  readonly commentsTabButton = this.page.locator('#comments-tab');
  readonly historyTabButton = this.page.locator('#history-tab');

  @logStep('Open Order Details page via URL')
  async open(id: string) {
    await this.openPage('ORDER_DETAILS', id);
    await this.waitForOpened();
  }

  @logStep('Get Order Values')
  async getOrderValues() {
    const [orderNumber, status, totalPrice, deliveryDate, createdOn] = await Promise.all([
      this.orderNumber.innerText(),
      this.status.innerText(),
      this.totalPrice.innerText(),
      this.deliveryDate.innerText(),
      this.createdOn.innerText(),
    ]);
    let assignedManagerName = '';
    if (await this.assignedManagerName.isVisible()) assignedManagerName = await this.assignedManagerName.innerText();
    else assignedManagerName = await this.noAssignedManagerText.innerText();

    return { orderNumber, assignedManagerName, status, totalPrice, deliveryDate, createdOn };
  }

  @logStep('Click Process Button')
  async clickProcess() {
    await this.processOrderButton.click();
    await this.processModal.waitForOpened();
  }

  @logStep('Click Cancel Button')
  async clickCancel() {
    await this.cancelOrderButton.click();
    await this.cancelModal.waitForOpened();
  }

  @logStep('Click Reopen Button')
  async clickReopen() {
    await this.reopenOrderButton.click();
    await this.reopenModal.waitForOpened();
  }

  @logStep('Click Refresh Button')
  async clickRefresh() {
    await this.refreshOrderButton.click();
  }

  @logStep('Click Add Assigned Manager Button')
  async clickAddAssignManager() {
    await this.noAssignedManagerText.click();
    await this.assignManagerModal.waitForOpened();
  }

  @logStep('Click Edit Assigned Manager Button')
  async clickEditAssignManager() {
    await this.editAssignedManagerButton.click();
    await this.assignManagerModal.waitForOpened();
  }

  @logStep('Click Remove Assigned Manager Button')
  async clickUnassignManager() {
    await this.removeAssignedManagerButton.click();
    await this.unassignModal.waitForOpened();
  }

  @logStep('Click оn Assigned Manager link')
  async clickAssignManagerLink() {
    await this.assignedManagerName.click();
  }
}
