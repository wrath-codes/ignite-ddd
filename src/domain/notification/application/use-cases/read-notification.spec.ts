import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ReadNotificationUseCase } from './read-notification'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeNotification } from 'test/factories/make-notification'

let notificationRepository: InMemoryNotificationRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository()
    sut = new ReadNotificationUseCase(notificationRepository)
  })

  it('should read a notification', async () => {
    const notification = makeNotification()

    await notificationRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(notificationRepository.items[0].readAt).toEqual(expect.any(Date))
  })

  it('should not be able to read a non-existing notification', async () => {
    const result = await sut.execute({
      recipientId: 'any_recipient_id',
      notificationId: 'any_notification_id',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification(
      {
        recipientId: new UniqueEntityID('recipient_01'),
      },
      new UniqueEntityID('notification_01'),
    )

    await notificationRepository.create(notification)

    const result = await sut.execute({
      recipientId: 'recipient_02',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
