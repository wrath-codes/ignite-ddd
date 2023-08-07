import { Entity } from '@/core/entities/entities'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface QuestionAttachmentProps {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId(): UniqueEntityID {
    return this.props.questionId
  }

  get attachmentId(): UniqueEntityID {
    return this.props.attachmentId
  }

  static create(
    props: QuestionAttachmentProps,
    id?: UniqueEntityID,
  ): QuestionAttachment {
    const questionAttachment = new QuestionAttachment(props, id)
    return questionAttachment
  }
}
