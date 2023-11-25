import { getUserId } from '../utils.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodoJob } from '../../businessLogic/todo.mjs'
export const handler = middy(async (event) => {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  const userId = getUserId(event)
  await updateTodoJob(todoId, updatedTodo, userId)
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
