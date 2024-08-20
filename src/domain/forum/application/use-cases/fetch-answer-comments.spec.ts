import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answers-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { InMemoryRegisterStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let inMemoryStudentRegisterRepository: InMemoryRegisterStudentRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch recent ', () => {
  beforeEach(() => {
    inMemoryStudentRegisterRepository = new InMemoryRegisterStudentRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentRegisterRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository)
  })

  it('Should be able to fetch recent answer', async () => {
    const student = makeStudent({
      name: 'Joe Doe',
    })

    inMemoryStudentRegisterRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentRepository.create(comment1)
    await inMemoryAnswerCommentRepository.create(comment2)
    await inMemoryAnswerCommentRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'Joe Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'Joe Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'Joe Doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('Should be able to fetch paginated recents ansers', async () => {
    const student = makeStudent({
      name: 'Joe Doe',
    })

    inMemoryStudentRegisterRepository.items.push(student)
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
