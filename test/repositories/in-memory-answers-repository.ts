import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)
  }
}
