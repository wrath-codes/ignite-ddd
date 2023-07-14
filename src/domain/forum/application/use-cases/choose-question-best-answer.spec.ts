import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'

let questionRepository: InMemoryQuestionsRepository
let answersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionsRepository()
    answersRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      questionRepository,
      answersRepository,
    )
  })

  it('should be able to choose a question best answer', async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('question-01'),
    )
    await questionRepository.create(question)

    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
        questionId: question.id,
      },
      new UniqueEntityID('answer-01'),
    )
    await answersRepository.create(answer)

    await sut.execute({
      authorId: 'author-01',
      answerId: 'answer-01',
    })

    expect(questionRepository.items[0]).toMatchObject({
      bestAnswerId: new UniqueEntityID('answer-01'),
    })
  })

  it('should not be able to choose a question best answer if it not exists', async () => {
    await expect(
      sut.execute({
        authorId: 'author-01',
        answerId: 'answer-01',
      }),
    ).rejects.toThrow('Answer not found')
  })

  it('should not be able to choose a question best answer if the question not exists', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )
    await answersRepository.create(answer)

    await expect(
      sut.execute({
        authorId: 'author-01',
        answerId: 'answer-01',
      }),
    ).rejects.toThrow('Question not found')
  })

  it('should not be able to choose another user question best answer', async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('question-01'),
    )
    await questionRepository.create(question)

    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-02'),
        questionId: question.id,
      },
      new UniqueEntityID('answer-01'),
    )
    await answersRepository.create(answer)

    await expect(
      sut.execute({
        authorId: 'author-02',
        answerId: 'answer-01',
      }),
    ).rejects.toThrow('Not Allowed')
  })
})
