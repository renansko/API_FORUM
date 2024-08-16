import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answers'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, right } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { Injectable } from '@nestjs/common'

interface AwnserQuestionUseCaseRequest {
  authorId: string
  questionId: string
  attachmentsIds: string[]
  content: string
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

// DRY - Don't repeat your self
@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}
  // Erro no eslint -> como ele identifica que o construtor está vazio, alerta um erro
  // Mas isso é valido no typescript então basta criar uma regra no .eslint.json

  async execute({
    authorId,
    questionId,
    content,
    attachmentsIds,
  }: AwnserQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
    })

    const answerAttachment = attachmentsIds.map((attachmentsIds) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentsIds),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachment)

    await this.answerRepository.create(answer)

    return right({
      answer,
    })
  }
}
