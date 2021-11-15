import { DefinedStringEnvVar } from './validation';

class AwsConfig {
  @DefinedStringEnvVar('AWS_REGION')
  REGION!: string;

  @DefinedStringEnvVar('AWS_ACCESS_KEY')
  ACCESS_KEY!: string;

  @DefinedStringEnvVar('AWS_SECRET_KEY')
  SECRET_KEY!: string;

  @DefinedStringEnvVar('AWS_SES_EMAIL_FROM')
  SES_EMAIL_FROM!: string;
}

export const AWS = new AwsConfig();
