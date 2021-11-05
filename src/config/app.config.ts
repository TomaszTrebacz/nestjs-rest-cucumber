import {
  OneOfEnvVar,
  PortEnvVar,
  LengthEnvVar,
  PositiveIntegerEnvVar,
  DefinedStringEnvVar,
  BooleanEnvVar,
} from './validation';

const envTypes = [
  'local',
  'test',
  'development',
  'staging',
  'production',
] as const;
type EnvType = typeof envTypes[number];

const logLevelTypes = ['debug', 'info', 'warn', 'error', 'fatal'] as const;
type LogLevelType = typeof logLevelTypes[number];

class AppConfig {
  @OneOfEnvVar('NODE_ENV', envTypes)
  ENV!: EnvType;

  @PortEnvVar('APP_PORT')
  PORT!: number;

  VERSION = process.env.APP_VERSION ?? null;

  BUILD_TIMESTAMP = process.env.APP_BUILD_TIMESTAMP ?? null;

  @OneOfEnvVar('APP_LOG_LEVEL', logLevelTypes)
  LOG_LEVEL!: LogLevelType;

  @BooleanEnvVar('APP_SWAGGER_IS_ENABLED')
  SWAGGER_IS_ENABLED!: boolean;

  @LengthEnvVar('APP_SECRET', 32)
  SECRET!: string;

  @PositiveIntegerEnvVar('APP_SESSION_DURATION_MINUTES')
  SESSION_DURATION_MINUTES!: number;

  get SESSION_DURATION_MILLIS() {
    return this.SESSION_DURATION_MINUTES * 60 * 1000;
  }

  @DefinedStringEnvVar('APP_FRONTEND_URL')
  FRONTEND_URL!: string;
}

export const APP = new AppConfig();
