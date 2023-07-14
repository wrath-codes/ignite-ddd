import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'

let answersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(answersRepository)
  })
  test('create an answer', async () => {
    const { answer } = await sut.execute({
      questionId: '1',
      instructorId: '2',
      content: 'Nova resposta',
    })

    expect(answer.id).toBeTruthy()
    expect(answersRepository.items[0].id).toEqual(answer.id)
  })
})
