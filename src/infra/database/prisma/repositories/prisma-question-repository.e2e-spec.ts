import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { StudentFractory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { QuestionFactory } from 'test/factories/make-question'
import { AttachmentFractory } from 'test/factories/make-attachments'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'

describe('Prisma question repository (E2E)', () => {
  let app: INestApplication
  let studentFractory: StudentFractory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFractory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let cacheRepository: CacheRepository
  let questionRepository: QuestionRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFractory,
        QuestionFactory,
        AttachmentFractory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFractory = moduleRef.get(StudentFractory)

    questionFactory = moduleRef.get(QuestionFactory)

    attachmentFactory = moduleRef.get(AttachmentFractory)

    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    cacheRepository = moduleRef.get(CacheRepository)

    questionRepository = moduleRef.get(QuestionRepository)

    await app.init()
  })

  it('Should cache question detail', async () => {
    const user = await studentFractory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    const questionDetails = await questionRepository.findDetailsBySlug(slug)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    if (!cached) {
      throw new Error()
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questiondId.toString(),
      }),
    )
  })

  it('Should return cached question details on subsequent calls', async () => {
    const user = await studentFractory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    // await cacheRepository.set(
    //   `question:${slug}:details`,
    //   JSON.stringify({ empty: true }),
    // )
    let cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toBeNull()

    await questionRepository.findDetailsBySlug(slug)

    cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).not.toBeNull()

    const questionDetails = await questionRepository.findDetailsBySlug(slug)

    if (!cached) {
      throw new Error()
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questiondId.toString(),
      }),
    )
  })

  it('Should reset question details cache when saving the question', async () => {
    const user = await studentFractory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    )

    await questionRepository.save(question)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toBeNull()
  })
})
