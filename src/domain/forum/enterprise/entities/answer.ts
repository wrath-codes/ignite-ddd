import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerAttachmentList } from './answer-attachment-list'
import { AnswerCreatedEvent } from '../events/answer-created-event'
import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AnswerProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  attachments: AnswerAttachmentList
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
  get authorId(): UniqueEntityID {
    return this.props.authorId
  }

  get questionId(): UniqueEntityID {
    return this.props.questionId
  }

  get content(): string {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get attachments(): AnswerAttachmentList {
    return this.props.attachments
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  get excerpt(): string {
    return this.props.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        ...props,
        createdAt: new Date(),
        attachments: props.attachments ?? new AnswerAttachmentList([]),
      },
      id,
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}
