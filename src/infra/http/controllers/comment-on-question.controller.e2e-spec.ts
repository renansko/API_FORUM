import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { StudentFractory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { QuestionFactory } from 'test/factories/make-question'

describe('Comment on question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFractory: StudentFractory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFractory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)

    studentFractory = moduleRef.get(StudentFractory)

    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[POST] /questions/:questionId/comments', async () => {
    const user = await studentFractory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New comment',
      })

    expect(response.statusCode).toBe(201)

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        content: 'New comment',
      },
    })

    expect(commentOnDatabase).toBeTruthy()
  })
})
