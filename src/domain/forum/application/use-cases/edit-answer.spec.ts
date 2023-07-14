import { EditAnswerUseCase } from './edit-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'

let answersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })

  it('should be able to edit a answer', async () => {
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
      content: 'New Content',
    })

    expect(answersRepository.items[0]).toMatchObject({
      content: 'New Content',
    })
  })

  it('should not be able to edit a answer if it not exists', async () => {
    await expect(
      sut.execute({
        authorId: 'author-01',
        answerId: 'answer-01',
        content: 'New Content',
      }),
    ).rejects.toThrow('Answer not found')
  })

  it('should not be able to edit a answer from another user', async () => {
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
        content: 'New Content',
      }),
    ).rejects.toThrow('Not Allowed')
  })
})
