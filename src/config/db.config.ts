import { DefinedStringEnvVar, PortEnvVar } from './validation';

class DbConfig {
  @DefinedStringEnvVar('DB_HOST')
  HOST!: string;

  @PortEnvVar('DB_PORT')
  PORT!: number;

  @DefinedStringEnvVar('DB_USERNAME')
  USERNAME!: string;

  @DefinedStringEnvVar('DB_PASSWORD')
  PASSWORD!: string;

  @DefinedStringEnvVar('DB_DATABASE')
  DATABASE!: string;
}

export const DB = new DbConfig();
