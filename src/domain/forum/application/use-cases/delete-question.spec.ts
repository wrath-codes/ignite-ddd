import { DeleteQuestionUseCase } from './delete-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'

let questionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('question-01'),
    )
    await questionsRepository.create(newQuestion)

    await sut.execute({
      authorId: 'author-01',
      questionId: 'question-01',
    })

    expect(questionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question if it not exists', async () => {
    await expect(
      sut.execute({
        authorId: 'author-01',
        questionId: 'question-01',
      }),
    ).rejects.toThrow('Question not found')
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('question-01'),
    )
    await questionsRepository.create(newQuestion)

    await expect(
      sut.execute({
        authorId: 'author-02',
        questionId: 'question-01',
      }),
    ).rejects.toThrow('Not Allowed')
  })
})
