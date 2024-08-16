import { Either, left, right } from './either'

function doSomething(x: boolean): Either<string, number> {
  if (x) {
    return right(10)
  } else {
    return left('error')
  }
}

test('Sucess result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toEqual(true)
})

test('Error result', () => {
  const result = doSomething(false)

  expect(result.isLeft()).toEqual(true)
})
