import { Notification } from '@/domain/notification/enterprise/entities/notification'
export interface NotificationRepository {
  create(natification: Notification): Promise<void>
  findById(id: string): Promise<Notification | null>
  save(notification: Notification): Promise<void>
}
