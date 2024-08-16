import { FakerUploader } from 'test/storage/fake-uploader'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'

let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let fakerUploader: FakerUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
    fakerUploader = new FakerUploader()

    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentRepository,
      fakerUploader,
    )
  })

  it('should be able to upload and create a attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentRepository.items[0],
    })
    expect(fakerUploader.uploads).toHaveLength(1)
    expect(fakerUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('not should be able upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })
})
