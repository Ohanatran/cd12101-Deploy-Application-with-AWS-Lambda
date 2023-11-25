import { deleteTodoJob } from '../../businessLogic/todo.mjs'
import { getUserId } from '../utils.mjs'

import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

export const handler = middy(async (event) => {
  const todoId = event.pathParameters.todoId
  // TODO: Remove a TODO item by id

  const userId = getUserId(event)
  console.log('user id: ', userId)
  await deleteTodoJob(todoId, userId)
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
})

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
