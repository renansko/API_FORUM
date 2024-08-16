import { RegisterStudentUseCase } from './register-student'
import { InMemoryRegisterStudentRepository } from 'test/repositories/in-memory-student-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryRegisterStudentRepository: InMemoryRegisterStudentRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryRegisterStudentRepository = new InMemoryRegisterStudentRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(
      inMemoryRegisterStudentRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'Joe Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryRegisterStudentRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'Joe Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRegisterStudentRepository.items[0].password).toEqual(
      '123456-hashed',
    )
  })
})
