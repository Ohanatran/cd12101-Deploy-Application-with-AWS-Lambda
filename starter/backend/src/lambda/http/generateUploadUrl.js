import { createAttachmentUrl } from '../../businessLogic/todo.mjs'
export async function handler(event) {
  const todoId = event.pathParameters.todoId
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const returnedUrl = await createAttachmentUrl(todoId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: returnedUrl
    })
  }
}
