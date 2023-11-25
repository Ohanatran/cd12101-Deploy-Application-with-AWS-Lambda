import { createLogger } from '../utils/logger.mjs'
import * as uuid from 'uuid'
import { AttachmentUtils } from '../utils/s3.mjs'
import { TodosAccess } from '../dataLayer/todosAccess.mjs'
// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const s3Utils = new AttachmentUtils()
const todoAccessLayer = new TodosAccess()

export async function getTodosForUser(userId) {
  logger.info('Get todos for user function')
  return todoAccessLayer.getAllTodos(userId)
}

export async function createToDoJob(todo, userId) {
  const todoId = uuid.v4()
  const todoBody = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: s3Utils.getAttachmentUrl(todoId),
    ...todo
  }
  return await todoAccessLayer.createNewTodo(todoBody)
}

export async function updateTodoJob(todoId, userId, todoUpdate) {
  logger.info('Update todo for user')
  return todoAccessLayer.updateTodo(todoId, userId, todoUpdate)
}

export async function deleteTodoJob(todoId, userId) {
  return todoAccessLayer.deleteTodoJob(todoId, userId)
}

export async function createAttachmentUrl(todoId) {
  return s3Utils.getUploadUrl(todoId)
}
