import AWS = require('aws-sdk');
import { config } from './config/config';

// Configure AWS
const credentials = new AWS.SharedIniFileCredentials({ profile: config.aws_profile });
AWS.config.credentials = {
  ...credentials,
  secretAccessKey: config.secretAccessKey || credentials.secretAccessKey,
  accessKeyId: config.accessKeyId || credentials.accessKeyId,
  sessionToken: config?.sessionToken || credentials.sessionToken,
};

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: config.aws_region,
  params: { Bucket: config.aws_media_bucket },
});
console.log(s3);

// Generates an AWS signed URL for retrieving objects
export function getGetSignedUrl(key: string): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('getObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}

// Generates an AWS signed URL for uploading objects
export async function getPutSignedUrl(key: string): Promise<string> {
  const signedUrlExpireSeconds = 60 * 5;
  console.log('key: ', key);
  console.log('config.aws_media_bucket: ', config.aws_media_bucket);
  const data = await s3.getSignedUrlPromise('putObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
  console.log('data: ', data);
  return data;
}
