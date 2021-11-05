import { DefinedStringEnvVar, PortEnvVar } from './validation';

class RedisConfig {
  @DefinedStringEnvVar('REDIS_HOST')
  HOST!: string;

  @PortEnvVar('REDIS_PORT')
  PORT!: number;
}

export const REDIS = new RedisConfig();
