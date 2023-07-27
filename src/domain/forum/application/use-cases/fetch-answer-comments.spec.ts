import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let answersRepository: InMemoryAnswersRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    answersRepository = new InMemoryAnswersRepository()
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const answer = makeAnswer({}, new UniqueEntityID('answer-01'))
    await answersRepository.create(answer)

    const answerComment_01 = makeAnswerComment(
      {
        answerId: answer.id,
      },
      new UniqueEntityID('answer-comment-01'),
    )

    const answerComment_02 = makeAnswerComment(
      {
        answerId: answer.id,
      },
      new UniqueEntityID('answer-comment-02'),
    )

    await answerCommentsRepository.create(answerComment_01)
    await answerCommentsRepository.create(answerComment_02)

    const result = await sut.execute({
      answerId: answer.id.toValue(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)
    expect(result.value?.answerComments).toMatchObject([
      expect.objectContaining({
        id: answerComment_01.id,
      }),
      expect.objectContaining({
        id: answerComment_02.id,
      }),
    ])
  })

  it('should be able to fetch answer comments with pagination', async () => {
    const answer = makeAnswer({}, new UniqueEntityID('answer-01'))
    await answersRepository.create(answer)

    for (let i = 1; i <= 22; i++) {
      const answerComment = makeAnswerComment(
        {
          answerId: answer.id,
        },
        new UniqueEntityID(`answer-comment-${i}`),
      )
      await answerCommentsRepository.create(answerComment)
    }

    const result = await sut.execute({
      answerId: answer.id.toValue(),
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toMatchObject([
      expect.objectContaining({
        id: new UniqueEntityID('answer-comment-21'),
      }),
      expect.objectContaining({
        id: new UniqueEntityID('answer-comment-22'),
      }),
    ])
  })
})
