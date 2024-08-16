import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { Module } from '@nestjs/common'
import { jwtEncrypter } from './jwt-encrypter'
import { HasherCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { HasherGenerator } from '@/domain/forum/application/cryptography/hasher-generator'
import { BcryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    { provide: Encrypter, useClass: jwtEncrypter },
    { provide: HasherCompare, useClass: BcryptHasher },
    { provide: HasherGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HasherCompare, HasherGenerator],
})
export class CryptographyModule {}
