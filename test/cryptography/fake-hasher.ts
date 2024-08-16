import { HasherCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { HasherGenerator } from '@/domain/forum/application/cryptography/hasher-generator'

export class FakeHasher implements HasherGenerator, HasherCompare {
  async compare(plain: string, hash: string) {
    return plain.concat('-hashed') === hash
  }

  async hash(plain: string) {
    return plain.concat('-hashed')
  }
}
