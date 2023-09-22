import { AnswerAttachment } from './answer-attachment'
import { WatchedList } from '@/core/entities/watched-list'

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
