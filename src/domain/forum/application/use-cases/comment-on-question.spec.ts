import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'

let questionRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on question', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionsRepository()
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(
      questionRepository,
      questionCommentsRepository,
    )
  })

  it('should be able to comment on a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('question-01'),
    )
    await questionRepository.create(newQuestion)

    await sut.execute({
      authorId: 'author-01',
      questionId: 'question-01',
      content: 'New Content',
    })

    expect(questionCommentsRepository.items[0]).toMatchObject({
      content: 'New Content',
    })
  })

  it('should not be able to comment on a question if it not exists', async () => {
    await expect(
      sut.execute({
        authorId: 'author-01',
        questionId: 'question-01',
        content: 'New Content',
      }),
    ).rejects.toThrow('Question not found')
  })
})
