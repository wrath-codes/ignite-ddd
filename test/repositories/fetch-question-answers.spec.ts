import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { InMemoryAnswersRepository } from './in-memory-answers-repository'
import { InMemoryQuestionsRepository } from './in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'

let answersRepository: InMemoryAnswersRepository
let questionsRepository: InMemoryQuestionsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchQuestionAnswersUseCase(answersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const question = makeQuestion({}, new UniqueEntityID('question-01'))
    await questionsRepository.create(question)

    const answer_01 = makeAnswer(
      {
        questionId: question.id,
      },
      new UniqueEntityID('answer-01'),
    )

    const answer_02 = makeAnswer(
      {
        questionId: question.id,
      },
      new UniqueEntityID('answer-02'),
    )
    await answersRepository.create(answer_01)
    await answersRepository.create(answer_02)

    const { answers } = await sut.execute({
      questionId: question.id.toValue(),
      page: 1,
    })

    expect(answers[0].id).toBeTruthy()
    expect(answers[1].id).toBeTruthy()
    expect(answers).toHaveLength(2)
    expect(answers).toMatchObject([
      expect.objectContaining({
        id: answer_01.id,
      }),
      expect.objectContaining({
        id: answer_02.id,
      }),
    ])
  })

  it('should be able to fetch question answers with pagination', async () => {
    const question = makeQuestion({}, new UniqueEntityID('question-01'))
    await questionsRepository.create(question)

    for (let i = 1; i <= 22; i++) {
      const answer = makeAnswer(
        {
          questionId: question.id,
        },
        new UniqueEntityID(`answer-${i}`),
      )
      await answersRepository.create(answer)
    }

    const { answers } = await sut.execute({
      questionId: question.id.toValue(),
      page: 2,
    })

    expect(answers[0].id).toBeTruthy()
    expect(answers).toHaveLength(2)
  })
})
