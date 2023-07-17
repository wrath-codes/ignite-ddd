import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let questionCommentRepository: InMemoryQuestionCommentsRepository
let questionRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete question comment', () => {
  beforeEach(() => {
    questionCommentRepository = new InMemoryQuestionCommentsRepository()
    questionRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionCommentUseCase(questionCommentRepository)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('question-01'),
    )
    await questionRepository.create(newQuestion)

    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-01'),
        questionId: new UniqueEntityID('question-01'),
      },
      new UniqueEntityID('question-comment-01'),
    )

    await questionCommentRepository.create(newQuestionComment)

    await sut.execute({
      authorId: 'author-01',
      questionCommentId: 'question-comment-01',
    })

    expect(questionCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question comment if it not exists', async () => {
    await expect(
      sut.execute({
        authorId: 'author-01',
        questionCommentId: 'question-comment-01',
      }),
    ).rejects.toThrow('Question comment not found')
  })

  it('should not be able to delete a question comment if the author is not the same', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('question-01'),
    )
    await questionRepository.create(newQuestion)

    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-01'),
        questionId: new UniqueEntityID('question-01'),
      },
      new UniqueEntityID('question-comment-01'),
    )

    await questionCommentRepository.create(newQuestionComment)

    await expect(
      sut.execute({
        authorId: 'author-02',
        questionCommentId: 'question-comment-01',
      }),
    ).rejects.toThrow('You cannot delete another user question comment')
  })
})
