import { createToDoJob } from '../../businessLogic/todo.mjs'
import { getUserId } from '../utils.mjs'
export async function handler(event) {
  const newTodo = JSON.parse(event.body)
  // TODO: Implement creating a new TODO item
  const userId = getUserId(event)
  const item = await createToDoJob(newTodo, userId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}
