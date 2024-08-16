import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['warn', 'error'],
    })
  }

  // Caso a aplicação Crash isso pode ajudar a realizar alguma função tipo fechar a conexão com o banco de dados
  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect
  }
}
