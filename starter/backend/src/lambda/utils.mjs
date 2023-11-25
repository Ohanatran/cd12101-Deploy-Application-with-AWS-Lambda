import { parseUserId } from '../auth/utils.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('http/getTodos')

export function getUserId(event) {
  // logger.info('----getUserId----', event.headers)
  console.log('----getUserId----', event.headers)
  const authorization =
    event.headers.Authorization || event.headers.authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}
