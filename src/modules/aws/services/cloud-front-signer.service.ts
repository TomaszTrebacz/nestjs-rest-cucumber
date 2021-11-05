import { Injectable } from '@nestjs/common';
import { CloudFront } from 'aws-sdk';
import { CONFIG } from '@/config';

@Injectable()
export class CloudFrontSignerService {
  signer = new CloudFront.Signer(
    CONFIG.AWS.CF_SIGNING_PUBLIC_KEY_ID,
    CONFIG.AWS.CF_SIGNING_PRIVATE_KEY,
  );

  getSignedUrl(fileKey: string) {
    return this.signer.getSignedUrl({
      url: `https://${CONFIG.AWS.CF_DOMAIN_NAME}/${fileKey}`,
      expires:
        Math.floor(Date.now() / 1000) +
        CONFIG.AWS.CF_SIGNING_EXPIRATION_SECONDS,
    });
  }
}
