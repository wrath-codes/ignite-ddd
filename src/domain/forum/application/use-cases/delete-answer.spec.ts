import { DeleteAnswerUseCase } from './delete-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'

let answersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be able to delete an answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )
    await answersRepository.create(newAnswer)

    await sut.execute({
      authorId: 'author-01',
      answerId: 'answer-01',
    })

    expect(answersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an answer if it not exists', async () => {
    await expect(
      sut.execute({
        authorId: 'author-01',
        answerId: 'answer-01',
      }),
    ).rejects.toThrow('Answer not found')
  })

  it('should not be able to delete an answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )
    await answersRepository.create(newAnswer)

    await expect(
      sut.execute({
        authorId: 'author-02',
        answerId: 'answer-01',
      }),
    ).rejects.toThrow('Not Allowed')
  })
})
