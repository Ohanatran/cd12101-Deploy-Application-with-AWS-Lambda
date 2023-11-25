import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import AWSXRay from 'aws-xray-sdk-core'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// TODO: Implement the fileStogare logic

export class AttachmentUtils {
  constructor() {
    this.s3 = AWSXRay.captureAWSv3Client(new S3Client({}))
    this.bucketName = process.env.IMAGE_S3_BUCKET
    this.urlExpiration = Number(process.env.SINGED_URL_EXPIRATION)
  }
  //  get attcment
  getAttachmentUrl(todoId) {
    return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
  }
  // get upload url
  async getUploadUrl(todoId) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: todoId,
        Expires: this.urlExpiration
      }

      const command = new PutObjectCommand(params)
      const url = await getSignedUrl(this.s3, command, {
        expires: this.urlExpiration
      })
      return url
    } catch (error) {
      console.error('Error generating signed URL:', error)
      throw error
    }
  }
}
