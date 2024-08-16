import { randomUUID } from 'crypto'
import {
  Uploader,
  UploadParams,
} from '../../src/domain/forum/application/storage/uploader'

interface Upload {
  fileName: string
  url: string
}

export class FakerUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams) {
    const url = randomUUID()

    this.uploads.push({
      fileName,
      url,
    })

    return { url }
  }
}
