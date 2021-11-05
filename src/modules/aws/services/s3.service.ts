import { extname } from 'path';
import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { PresignedPost } from 'aws-sdk/clients/s3';
import { parse } from 'content-disposition';
import { CONFIG } from '@/config';
import { Nullable } from '@/common/types';
import { createRandomToken } from '@/common/utils';
import { AWS_ERROR } from '@/modules/aws/aws.constant';

type AssignFileOptions = {
  uploadToken: Nullable<string>;
  prefix: string;
  maxSize: number;
  allowedExtensions?: string[];
};
export type AssignFileResult = {
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
};

@Injectable()
export class S3Service {
  client = new S3({
    region: CONFIG.AWS.REGION,
    credentials: {
      accessKeyId: CONFIG.AWS.ACCESS_KEY,
      secretAccessKey: CONFIG.AWS.SECRET_KEY,
    },
  });
  bucket = CONFIG.AWS.CDN_BUCKET_NAME;

  async createPreSignedPost(params: Omit<PresignedPost.Params, 'Bucket'>) {
    return this.client.createPresignedPost({
      Bucket: this.bucket,
      ...params,
    });
  }

  async headObjectOrThrow(Key: string): Promise<S3.HeadObjectOutput> {
    try {
      return await this.client
        .headObject({
          Bucket: this.bucket,
          Key,
        })
        .promise();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.name === 'NotFound') {
        throw AWS_ERROR.FILE_NOT_FOUND;
      }

      throw err;
    }
  }

  getObjectFileName(object: S3.HeadObjectOutput): undefined | string {
    if (object.ContentDisposition === undefined) {
      return;
    }

    return parse(object.ContentDisposition).parameters.filename;
  }

  private isFileNameExtensionValid(
    fileName: string,
    allowedExtensions: string[],
  ): boolean {
    const extension = extname(fileName);

    return allowedExtensions.includes(extension);
  }

  async assignFile(options: AssignFileOptions): Promise<AssignFileResult> {
    const { uploadToken, prefix, maxSize, allowedExtensions } = options;
    const tmpKey = `tmp/${uploadToken}`;
    const object = await this.headObjectOrThrow(`tmp/${uploadToken}`);
    const fileName = this.getObjectFileName(object);
    const mimeType = object.ContentType ?? 'application/octet-stream';

    if (!fileName) {
      throw new Error(`Assigned fileName couldn't be parsed`);
    }

    const fileSize = object.ContentLength;

    if (!fileSize || fileSize > maxSize) {
      throw AWS_ERROR.FILE_EXCEEDED_MAX_SIZE;
    }

    if (
      allowedExtensions !== undefined &&
      !this.isFileNameExtensionValid(fileName, allowedExtensions)
    ) {
      throw AWS_ERROR.FILE_INVALID_EXTENSION;
    }

    const token = await createRandomToken();
    const filePath = `${prefix}${token}`;

    await this.client
      .copyObject({
        CopySource: `${this.bucket}/${tmpKey}`,
        Bucket: this.bucket,
        Key: filePath,
        ACL: 'private',
      })
      .promise();

    return { filePath, fileName, fileSize, mimeType };
  }
}
