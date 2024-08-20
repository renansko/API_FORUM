import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryRegisterStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryRegisterStudentRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch recent ', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryRegisterStudentRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
  })

  it('Should be able to fetch recent question', async () => {
    const student = makeStudent({
      name: 'Joe Doe',
    })

    inMemoryStudentsRepository.items.push(student)
    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentRepository.create(comment1)
    await inMemoryQuestionCommentRepository.create(comment2)
    await inMemoryQuestionCommentRepository.create(comment3)

    const result = await sut.execute({
      questionId: 'question-1',
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

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
