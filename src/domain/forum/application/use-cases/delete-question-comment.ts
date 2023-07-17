import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}

interface DeleteQuestionCommentUseCaseResponse {
  questionComment: QuestionComment
}

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.questionCommentsRepository.findById(
      questionCommentId,
    )

    if (!questionComment) {
      throw new Error('Question comment not found')
    }

    if (questionComment.authorId.toString() !== authorId) {
      throw new Error('You cannot delete another user question comment')
    }

    await this.questionCommentsRepository.delete(questionComment)

    return {
      questionComment,
    }
  }
}
