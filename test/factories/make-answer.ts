import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
): Answer {
  const answer = Answer.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityID('1'),
      questionId: new UniqueEntityID('1'),
      ...override,
    },
    id,
  )

  return answer
}
