import { DefinedStringEnvVar, PositiveIntegerEnvVar } from './validation';

class AwsConfig {
  @DefinedStringEnvVar('AWS_REGION')
  REGION!: string;

  @DefinedStringEnvVar('AWS_ACCESS_KEY')
  ACCESS_KEY!: string;

  @DefinedStringEnvVar('AWS_SECRET_KEY')
  SECRET_KEY!: string;

  @DefinedStringEnvVar('AWS_SES_EMAIL_FROM')
  SES_EMAIL_FROM!: string;

  @DefinedStringEnvVar('AWS_CDN_BUCKET_NAME')
  CDN_BUCKET_NAME!: string;

  @DefinedStringEnvVar('AWS_CF_DOMAIN_NAME')
  CF_DOMAIN_NAME!: string;

  @DefinedStringEnvVar('AWS_CF_SIGNING_PUBLIC_KEY_ID')
  CF_SIGNING_PUBLIC_KEY_ID!: string;

  @DefinedStringEnvVar('AWS_CF_SIGNING_PRIVATE_KEY')
  CF_SIGNING_PRIVATE_KEY!: string;

  @PositiveIntegerEnvVar('AWS_CF_SIGNING_EXPIRATION_SECONDS')
  CF_SIGNING_EXPIRATION_SECONDS!: number;
}

export const AWS = new AwsConfig();
