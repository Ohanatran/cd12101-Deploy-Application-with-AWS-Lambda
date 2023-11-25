import { getUserId } from '../utils.mjs'
import { updateTodoJob } from '../../businessLogic/todo.mjs'
export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
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
}
