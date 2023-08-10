import { EditAnswerUseCase } from './edit-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    answerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentRepository,
    )
    sut = new EditAnswerUseCase(answersRepository, answerAttachmentRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )
    await answersRepository.create(newAnswer)

    const newAnswerAttachment1 = makeAnswerAttachment({
      answerId: newAnswer.id,
      attachmentId: new UniqueEntityID('1'),
    })

    const newAnswerAttachment2 = makeAnswerAttachment({
      answerId: newAnswer.id,
      attachmentId: new UniqueEntityID('2'),
    })

    answerAttachmentRepository.items.push(
      newAnswerAttachment1,
      newAnswerAttachment2,
    )

    const result = await sut.execute({
      authorId: 'author-01',
      answerId: 'answer-01',
      content: 'New Content',
      attachmentIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(answersRepository.items[0]).toMatchObject({
      content: 'New Content',
    })
    expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(answersRepository.items[0].attachments.currentItems).toEqual(
      expect.objectContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
      ]),
    )
  })

  it('should not be able to edit a answer if it not exists', async () => {
    const result = await sut.execute({
      authorId: 'author-01',
      answerId: 'answer-01',
      content: 'New Content',
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )
    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-02',
      answerId: 'answer-01',
      content: 'New Content',
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
