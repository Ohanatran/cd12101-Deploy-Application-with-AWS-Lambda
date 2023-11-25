import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createAttachmentUrl } from '../../businessLogic/todo.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy(async (event) => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  console.log('userId: ', userId)
  const returnUrl = await createAttachmentUrl(todoId, userId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: returnUrl
    })
  }
})

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
