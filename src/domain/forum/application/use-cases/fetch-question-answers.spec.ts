import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'

let answersRepository: InMemoryAnswersRepository
let questionsRepository: InMemoryQuestionsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
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

    const result = await sut.execute({
      questionId: question.id.toValue(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toMatchObject([
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

    const result = await sut.execute({
      questionId: question.id.toValue(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
