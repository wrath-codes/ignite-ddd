import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const question = makeQuestion({}, new UniqueEntityID('question-01'))
    await questionsRepository.create(question)

    const questionComment_01 = makeQuestionComment(
      {
        questionId: question.id,
      },
      new UniqueEntityID('question-comment-01'),
    )

    const questionComment_02 = makeQuestionComment(
      {
        questionId: question.id,
      },
      new UniqueEntityID('question-comment-02'),
    )

    await questionCommentsRepository.create(questionComment_01)
    await questionCommentsRepository.create(questionComment_02)

    const result = await sut.execute({
      questionId: question.id.toValue(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
    expect(result.value?.questionComments).toMatchObject([
      expect.objectContaining({
        id: questionComment_01.id,
      }),
      expect.objectContaining({
        id: questionComment_02.id,
      }),
    ])
  })

  it('should be able to fetch question comments with pagination', async () => {
    const question = makeQuestion({}, new UniqueEntityID('question-01'))
    await questionsRepository.create(question)

    for (let i = 1; i <= 22; i++) {
      const questionComment = makeQuestionComment(
        {
          questionId: question.id,
        },
        new UniqueEntityID(`question-comment-${i}`),
      )
      await questionCommentsRepository.create(questionComment)
    }

    const result = await sut.execute({
      questionId: question.id.toValue(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
    expect(result.value?.questionComments).toMatchObject([
      expect.objectContaining({
        id: new UniqueEntityID('question-comment-21'),
      }),
      expect.objectContaining({
        id: new UniqueEntityID('question-comment-22'),
      }),
    ])
  })
})
