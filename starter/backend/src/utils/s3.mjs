import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import AWSXRay from 'aws-xray-sdk-core'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export class AttachmentUtils {
  constructor() {
    this.s3 = AWSXRay.captureAWSv3Client(new S3Client({}))
    this.bucketName = process.env.IMAGE_S3_BUCKET
    this.urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)
  }

  // Get attachment URL
  getAttachmentUrl(todoId) {
    return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
  }

  // Get upload URL
  async getUploadUrl(todoId) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: todoId
      }

      const command = new PutObjectCommand(params)

      // Calculate the expiration time as the current time plus the expiration duration
      const expirationTime = new Date()
      expirationTime.setSeconds(
        expirationTime.getSeconds() + this.urlExpiration
      )

      const url = await getSignedUrl(this.s3, command, {
        expiresIn: this.urlExpiration,
        signingDate: expirationTime
      })

      return url
    } catch (error) {
      console.error('Error generating signed URL:', error)
      throw error
    }
  }
}
