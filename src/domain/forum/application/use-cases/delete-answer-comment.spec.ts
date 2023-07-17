import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let answerCommentRepository: InMemoryAnswerCommentsRepository
let answerRepository: InMemoryAnswersRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete answer comment', () => {
  beforeEach(() => {
    answerCommentRepository = new InMemoryAnswerCommentsRepository()
    answerRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerCommentUseCase(answerCommentRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )
    await answerRepository.create(newAnswer)

    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-01'),
        answerId: new UniqueEntityID('answer-01'),
      },
      new UniqueEntityID('answer-comment-01'),
    )

    await answerCommentRepository.create(newAnswerComment)

    await sut.execute({
      authorId: 'author-01',
      answerCommentId: 'answer-comment-01',
    })

    expect(answerCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer comment if it not exists', async () => {
    await expect(
      sut.execute({
        authorId: 'author-01',
        answerCommentId: 'answer-comment-01',
      }),
    ).rejects.toThrow('Answer comment not found')
  })

  it('should not be able to delete a answer comment if the author is not the same', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )
    await answerRepository.create(newAnswer)

    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-02'),
        answerId: new UniqueEntityID('answer-01'),
      },
      new UniqueEntityID('answer-comment-01'),
    )

    await answerCommentRepository.create(newAnswerComment)

    await expect(
      sut.execute({
        authorId: 'author-01',
        answerCommentId: 'answer-comment-01',
      }),
    ).rejects.toThrow('You cannot delete another user answer comment')
  })
})
