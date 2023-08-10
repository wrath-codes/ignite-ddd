import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'

export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Notification[] = []

  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }

  async findById(id: string): Promise<Notification | null> {
    return this.items.find((item) => item.id.toString() === id) || null
  }

  async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === notification.id.toString(),
    )
    this.items[index] = notification
  }
}
