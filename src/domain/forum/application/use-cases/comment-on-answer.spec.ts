import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'

let answerRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on answer', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(answerRepository, answerCommentsRepository)
  })

  it('should be able to comment on a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )
    await answerRepository.create(newAnswer)

    await sut.execute({
      authorId: 'author-01',
      answerId: 'answer-01',
      content: 'New Content',
    })

    expect(answerCommentsRepository.items[0]).toMatchObject({
      content: 'New Content',
    })
  })

  it('should not be able to comment on a answer if it not exists', async () => {
    await expect(
      sut.execute({
        authorId: 'author-01',
        answerId: 'answer-01',
        content: 'New Content',
      }),
    ).rejects.toThrow('Answer not found')
  })
})
