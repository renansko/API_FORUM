import { Notification } from '../../enterprise/notification'

export interface NotificationRepository {
  create(notification: Notification): Promise<void>
  findById(id: string): Promise<Notification | null>
  save(notification: Notification): Promise<void>
}
