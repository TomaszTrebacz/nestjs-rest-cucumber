import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

type EnvVarValidatorOptions<T> = {
  name: string;
  parse?: (envValue: string, param: T) => unknown;
  validate?: (envValue: string, param: T) => boolean;
  errorMessage: (envName: string, param: T) => string;
};

const envVarValidator =
  <T = void>({
    name,
    parse,
    validate,
    errorMessage,
  }: EnvVarValidatorOptions<T>) =>
  (envName: string, param: T, validationOptions?: ValidationOptions) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: object, propertyName: string) => {
      registerDecorator({
        name,
        target: target.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: unknown, args: ValidationArguments): boolean {
            const envValue = process.env[envName];

            if (envValue === undefined) {
              return false;
            }

            const relatedObject = args.object as Record<string, unknown>;

            relatedObject[args.property] = parse
              ? parse(envValue, param)
              : envValue;

            return validate ? validate(envValue, param) : true;
          },
          defaultMessage(): string {
            return errorMessage(envName, param);
          },
        },
      });
    };
  };

export const DefinedStringEnvVar = envVarValidator({
  name: 'definedStringEnvVar',
  errorMessage(envName: string) {
    return `${envName} has to be defined`;
  },
});

export const BooleanEnvVar = envVarValidator({
  name: 'booleanEnvVar',
  parse(envValue: string) {
    return envValue === 'true';
  },
  validate(envValue: string) {
    return ['true', 'false'].includes(envValue);
  },
  errorMessage(envName: string) {
    return `${envName} has to defined as boolean string - "true" or "false"`;
  },
});

export const PortEnvVar = envVarValidator({
  name: 'portEnvVar',
  parse(envValue: string) {
    return Number(envValue);
  },
  validate(envValue: string) {
    const numericValue = Number(envValue);

    return (
      Number.isInteger(numericValue) &&
      numericValue >= 0 &&
      numericValue <= 65535
    );
  },
  errorMessage(envName: string) {
    return `${envName} has to be defined as number in range 0-65535`;
  },
});

export const PositiveIntegerEnvVar = envVarValidator({
  name: 'positiveIntegerEnvVar',
  parse(envValue: string) {
    return Number(envValue);
  },
  validate(envValue: string) {
    const numericValue = Number(envValue);

    return Number.isInteger(numericValue) && numericValue > 0;
  },
  errorMessage(envName: string) {
    return `${envName} has to be defined as positive number`;
  },
});

export const OneOfEnvVar = envVarValidator<string[] | readonly string[]>({
  name: 'oneOfEnvVar',
  validate(envValue: string, param) {
    return param.includes(envValue);
  },
  errorMessage(envName: string, param) {
    return `${envName} has to be defined as one of: ${param.join(' | ')}`;
  },
});

export const LengthEnvVar = envVarValidator<number>({
  name: 'lengthEnvVar',
  validate(envValue: string, length) {
    return envValue.length === length;
  },
  errorMessage(envName: string, length) {
    return `${envName} has to be contain exactly ${length} characters`;
  },
});
