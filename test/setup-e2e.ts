import { config } from 'dotenv'

import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { execSync } from 'child_process'
import { DomainEvents } from '@/core/events/domain-events'
import { Redis } from 'ioredis'
import { envSchema } from '@/infra/auth/env/env'

const env = envSchema.parse(process.env)

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const prisma = new PrismaClient()
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})

function generateUniqueDataBaseUrl(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provider DATABASE_URL environment variable')
  }
  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseUrl = generateUniqueDataBaseUrl(schemaId)

  process.env.DATABASE_URL = databaseUrl

  DomainEvents.shouldRun = false

  await redis.flushdb()

  execSync('npx prisma migrate deploy') // npx
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect
})
