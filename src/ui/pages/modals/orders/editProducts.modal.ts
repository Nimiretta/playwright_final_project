import { logStep } from 'utils';
import { Modal } from '../modal.page';
import { expect } from 'fixtures';

export class EditProductsModal extends Modal {
  readonly addProductButton = this.modalContainer.locator('#add-product-btn');
  readonly saveButton = this.modalContainer.locator('#update-products-btn');
  readonly cancelButton = this.modalContainer.locator('#cancel-edit-products-modal-btn');
  readonly totalPrice = this.modalContainer.locator('#total-price-order-modal');
  readonly deleteProductButton = this.modalContainer.locator('.del-btn-modal');
  readonly productDropdown = this.modalContainer.locator('select');
  uniqueElement = this.modalContainer;

  @logStep('Click add prodduct button')
  async add() {
    const numberOfProducts = await this.productDropdown.count();
    console.log(numberOfProducts);
    await this.addProductButton.click();
    console.log(await this.productDropdown.count());
    expect(this.productDropdown).toHaveCount(numberOfProducts + 1);
  }
  @logStep('Click delete product button')
  async delete(productNumber: number) {
    const numberOfProduct = await this.productDropdown.count();
    await this.deleteProductButton.nth(productNumber).click();
    expect(this.productDropdown).toHaveCount(numberOfProduct - 1);
  }

  @logStep('Select product')
  async selectProduct(productNumber: number, productName: string) {
    await this.productDropdown.nth(productNumber - 1).selectOption(productName);
    expect(this.productDropdown.nth(productNumber - 1)).toHaveValue(productName);
  }

  @logStep('Click save button')
  async submit() {
    await this.saveButton.click();
    await this.waitForClosed();
  }

  @logStep('Click cancel button')
  async cancel() {
    await this.cancelButton.click();
    await this.waitForClosed();
  }
}
