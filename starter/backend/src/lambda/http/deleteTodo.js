import { getUserId } from '../utils.mjs'
import { deleteTodoJob } from '../../businessLogic/todo.mjs'
export async function handler(event) {
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
}
