import { getTodosForUser } from '../../businessLogic/todo.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

const logger = createLogger('http/getTodos')

// export const handler = middy()
//   .use(httpErrorHandler())
//   .use(
//     cors({
//       credentials: true
//     })
//   )
//   .handler(async (event) => {})
export const handler = async (event) => {
  const userId = getUserId(event)
  console.log('---userId----', userId)
  const todos = await getTodosForUser(userId)
  logger.info('---get todos---', todos)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: todos
    })
  }
}
