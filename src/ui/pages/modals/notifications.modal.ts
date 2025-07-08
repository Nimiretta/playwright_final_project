import { Modal } from './modal.page';
import { INotificationsFromModal, NotificationMsg } from 'types';

export class NotificationsModal extends Modal {
  readonly notificationsModal = this.page.locator('#notification-popover');
  readonly notificationsList = this.notificationsModal.locator('#notification-list');
  readonly readAllButton = this.notificationsModal.locator('#mark-all-read');
  readonly closeButton = this.notificationsModal.locator('.btn-close');
  readonly notifications = this.notificationsList.locator('.list-group-item');
  readonly topNotification = this.notification.nth(0);

  uniqueElement = this.notificationsModal;

  async getNotifications(): Promise<INotificationsFromModal[]> {
    const count = await this.notifications.count();
    const notifications: INotificationsFromModal[] = [];

    for (let i = 0; i < count; i++) {
      const item = this.notifications.nth(i);
      const container = item.locator('div');
      const orderLink = item.locator('[data-testid="order-details-link"]');

      const id = await container.getAttribute('data-notificationid');
      const read = (await container.getAttribute('data-read')) === 'true';
      const date = await item.locator('[data-testid="notification-date"]').innerText();
      const text = await item.locator('[data-testid="notification-text"]').innerText();
      const onClick = await orderLink.getAttribute('onclick');
      const orderId = onClick?.split("'")[1] ?? null;

      notifications.push({
        id: id || '',
        date: date.trim(),
        text: text.trim() as NotificationMsg,
        read: read,
        orderId: orderId || '',
      });
    }

    return notifications;
  }

  async getNotificationById(id: string): Promise<INotificationsFromModal | undefined> {
    const notifications = await this.getNotifications();
    return notifications.find((notification) => notification.id === id);
  }

  async getNotificationByOrderId(orderId: string): Promise<INotificationsFromModal | undefined> {
    const notifications = await this.getNotifications();
    return notifications.find((notification) => notification.orderId === orderId);
  }

  async getNotificationByIndex(index: number): Promise<INotificationsFromModal | undefined> {
    const notifications = await this.getNotifications();
    return notifications[index];
  }
}
