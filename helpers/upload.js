import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_KEY,
  AWS_S3_BUCKET,
  AWS_REGION
} from '../config/aws';
const AWS = require("aws-sdk");

const multer = require('multer');
const storage = multer.memoryStorage()
const fileRequest = multer({ storage });


// const s3 = new AWS.S3();

const s3Bucket = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_KEY,
  Bucket: AWS_S3_BUCKET,
  region: AWS_REGION
});



const uploadFile = (payload) => {

  if (payload.Key && payload.Body) {
    return s3Bucket.upload({
      Bucket: AWS_S3_BUCKET,
      ContentType: `image/jpeg`,
      Key: payload.Key,
      Body: payload.Body
    }).promise()
  }

  throw Error('Key and Body fields are required')
};

const deleteFile = (payload) => {

  if (payload.Key) {
    return s3Bucket.deleteObject({
      Bucket: AWS_S3_BUCKET,
      Key: payload.Key,

    }).promise()
  }

  throw Error('Key and Body fields are required')
};



const base64ToBuffer = base64Strings => {
  return Buffer.from(base64Strings.replace(/^data:image\/\w+;base64,/, ''), 'base64');
}
export { base64ToBuffer, fileRequest, uploadFile, deleteFile };