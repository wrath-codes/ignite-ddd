import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
): Question {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      authorId: new UniqueEntityID('1'),
      ...override,
    },
    id,
  )

  return question
}
