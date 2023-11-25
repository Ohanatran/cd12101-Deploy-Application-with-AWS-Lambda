import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl =
  'https://dev-3zy73mrfubkqqmq3.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  logger.info('Token', authHeader.substring(0, 20))
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  const res = await Axios.get(jwksUrl)
  const { keys } = res.data
  const signinKey = keys.find((key) => key.kid === jwt.header.kid)
  logger.info('----signinkey---', signinKey)
  if (!signinKey) {
    throw new Error('SigninKey is invalid')
  }
  // got Data
  const pemData = signinKey.x5c[0]
  // convert to secret format
  const secretKey = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----\n`
  logger.info('-----secretKey----', secretKey)
  // verify token
  const tokenVerified = jsonwebtoken.verify(token, secretKey, {
    algorithms: ['RS256']
  })
  logger.info('--tokenVerified--', tokenVerified)
  return tokenVerified
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
