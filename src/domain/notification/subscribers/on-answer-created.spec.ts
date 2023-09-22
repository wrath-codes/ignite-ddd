import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../application/use-cases/send-notification'

import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { OnAnswerCreated } from './on-answer-created'
import { SpyInstance } from 'vitest'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { waitFor } from 'test/utils/wait-for'

let answersRepository: InMemoryAnswersRepository
let answersAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let questionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let notificationsRepository: InMemoryNotificationRepository
let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('OnAnswerCreated', () => {
  beforeEach(() => {
    answersAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answersAttachmentsRepository,
    )
    questionsAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionsAttachmentsRepository,
    )
    notificationsRepository = new InMemoryNotificationRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCreated(questionsRepository, sendNotificationUseCase)
  })

  it('should send a notification when a new answer is created', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({ questionId: question.id })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
