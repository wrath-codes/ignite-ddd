import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let answerCommentRepository: InMemoryAnswerCommentsRepository
let answerRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete answer comment', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answerCommentRepository = new InMemoryAnswerCommentsRepository()
    answerRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new DeleteAnswerCommentUseCase(answerCommentRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )
    await answerRepository.create(newAnswer)

    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-01'),
        answerId: new UniqueEntityID('answer-01'),
      },
      new UniqueEntityID('answer-comment-01'),
    )

    await answerCommentRepository.create(newAnswerComment)

    await sut.execute({
      authorId: 'author-01',
      answerCommentId: 'answer-comment-01',
    })

    expect(answerCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer comment if it not exists', async () => {
    const result = await sut.execute({
      authorId: 'author-01',
      answerCommentId: 'answer-comment-01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a answer comment if the author is not the same', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )
    await answerRepository.create(newAnswer)

    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-02'),
        answerId: new UniqueEntityID('answer-01'),
      },
      new UniqueEntityID('answer-comment-01'),
    )

    await answerCommentRepository.create(newAnswerComment)

    const result = await sut.execute({
      authorId: 'author-01',
      answerCommentId: 'answer-comment-01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
