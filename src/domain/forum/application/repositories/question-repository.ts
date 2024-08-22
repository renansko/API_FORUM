import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'

export abstract class QuestionRepository {
  abstract findById(id: string): Promise<Question | null>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>
  abstract findManyRecent(param: PaginationParams): Promise<Question[]>
  abstract create(answer: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
}
