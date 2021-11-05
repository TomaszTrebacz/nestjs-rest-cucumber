import { Module } from '@nestjs/common';
import { CloudFrontSignerService } from '@/modules/aws/services/cloud-front-signer.service';
import { S3Service } from '@/modules/aws/services/s3.service';

@Module({
  providers: [S3Service, CloudFrontSignerService],
  exports: [S3Service, CloudFrontSignerService],
})
export class AwsModule {}
