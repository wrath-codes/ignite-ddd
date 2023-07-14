import { EditQuestionUseCase } from './edit-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'

let questionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(questionsRepository)
  })

  it('should be able to edit a question', async () => {
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
      title: 'New Title',
      content: 'New Content',
    })

    expect(questionsRepository.items[0]).toMatchObject({
      title: 'New Title',
      content: 'New Content',
    })
  })

  it('should not be able to edit a question if it not exists', async () => {
    await expect(
      sut.execute({
        authorId: 'author-01',
        questionId: 'question-01',
      }),
    ).rejects.toThrow('Question not found')
  })

  it('should not be able to edit a question from another user', async () => {
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
