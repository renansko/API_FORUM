import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { StudentFractory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { AttachmentFractory } from 'test/factories/make-attachments'

describe('Create question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFractory: StudentFractory
  let attachmentFactory: AttachmentFractory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFractory, AttachmentFractory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)

    studentFractory = moduleRef.get(StudentFractory)

    attachmentFactory = moduleRef.get(AttachmentFractory)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const user = await studentFractory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New question',
        content: 'Question content',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      })
    expect(response.statusCode).toBe(201)

    const questionOnDataBase = await prisma.question.findFirst({
      where: {
        title: 'New question',
      },
    })

    expect(questionOnDataBase).toBeTruthy()

    const attachmentOnDataBase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDataBase?.id,
      },
    })

    expect(attachmentOnDataBase).toHaveLength(2)
  })
})
