import { createLogger } from '../utils/logger.mjs'
import AWSXRay from 'aws-xray-sdk-core'
import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'

const logger = createLogger('dataAccessLayer/todosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
  constructor() {
    this.docClient = AWSXRay.captureAWSv3Client(
      new DynamoDBClient({ region: 'us-east-1' })
    )
    this.todosTable = process.env.TODOS_TABLE
    this.todosIndex = process.env.INDEX_NAME
  }

  async getAllTodos(userId) {
    try {
      const response = await this.docClient.send(
        new QueryCommand({
          TableName: this.todosTable,
          IndexName: this.todosIndex,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': { S: userId }
          }
        })
      )
      const items = response.Items || []
      return items
    } catch (error) {
      throw error
    }
  }

  async createNewTodo(item) {
    console.log('---item--', item)
    const dynamoItem = marshall(item)
    return await this.docClient.send(
      new PutItemCommand({
        TableName: this.todosTable,
        Item: dynamoItem
      })
    )
  }

  async updateTodo(todoId, userId, todoUpdate) {
    const result = await this.docClient.send(
      new UpdateItemCommand({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ExpressionAttributeValues: {
          ':name': todoUpdate.name,
          ':dueDate': todoUpdate.dueDate,
          ':done': todoUpdate.done
        },
        ReturnValues: 'ALL_NEW'
      })
    )
    const itemUpdated = result.Attributes
    return itemUpdated
  }

  async deleteTodoJob(todoId, userId) {
    console.log('==todoId=', todoId)
    console.log('==userId=', userId)
    const result = await this.docClient.send(
      new DeleteItemCommand({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        }
      })
    )
    logger.info('-----deleted todo item------', result)
    return todoId
  }
}
