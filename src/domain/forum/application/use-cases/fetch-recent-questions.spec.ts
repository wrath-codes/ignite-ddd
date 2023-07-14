import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'

let questionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    const newQuestion = makeQuestion({}, new UniqueEntityID('question-01'))
    await questionsRepository.create(newQuestion)

    const { questions } = await sut.execute({
      page: 1,
    })

    expect(questions[0].id).toBeTruthy()
    expect(questions[0].id.toValue()).toEqual('question-01')
  })

  it('should be able to fetch recent questions with pagination', async () => {
    for (let i = 1; i <= 22; i++) {
      const newQuestion = makeQuestion({}, new UniqueEntityID(`question-${i}`))
      await questionsRepository.create(newQuestion)
    }

    const { questions } = await sut.execute({
      page: 2,
    })

    expect(questions[0].id).toBeTruthy()
    expect(questions).toHaveLength(2)
  })
})