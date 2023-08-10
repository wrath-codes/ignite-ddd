import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { SendNotificationUseCase } from './send-notification'

let notificationRepository: InMemoryNotificationRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository()
    sut = new SendNotificationUseCase(notificationRepository)
  })

  it('should create a notification', async () => {
    const result = await sut.execute({
      recipientId: 'any_recipient_id',
      title: 'any_title',
      content: 'any_content',
    })

    expect(result.isRight()).toBeTruthy()
    expect(notificationRepository.items.length).toBe(1)
    expect(notificationRepository.items[0]).toEqual(result.value?.notification)
  })
})
