import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/questions-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = []

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComment = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .splice((page - 1) * 20, page * 20)

    return questionComment
  }

  async findById(id: string) {
    const questioncomment = this.items.find((item) => item.id.toString() === id)

    if (!questioncomment) {
      return null
    }

    return questioncomment
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questioncomment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questioncomment.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
