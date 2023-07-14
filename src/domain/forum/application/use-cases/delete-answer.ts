import { AnswersRepository } from '../repositories/answers-repository'

interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeleteAnswerUseCaseResponse {}

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const Answer = await this.answerRepository.findById(answerId)

    if (!Answer) {
      throw new Error('Answer not found')
    }

    if (authorId !== Answer.authorId.toString()) {
      throw new Error('Not Allowed')
    }

    await this.answerRepository.delete(Answer)

    return {}
  }
}
