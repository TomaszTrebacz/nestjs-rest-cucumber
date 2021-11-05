import {
  Matches,
  ValidateIf,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { composePropertyDecorators } from '@/common/utils';

/**
 * Skips validation if the target is null
 */
export const IsNullable = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: object,
    propertyKey: string | symbol,
  ) => {
    ValidateIf((obj) => obj[propertyKey] !== null, validationOptions)(
      target,
      propertyKey,
    );
  };
};

/**
 * Skips validation if the target is undefined
 */
export const IsUndefinable = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: object,
    propertyKey: string | symbol,
  ) => {
    ValidateIf((obj) => obj[propertyKey] !== undefined, validationOptions)(
      target,
      propertyKey,
    );
  };
};

export const IsTrimmed = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: object, propertyKey: string | symbol) => {
    registerDecorator({
      name: 'isTrimmed',
      target: target.constructor,
      propertyName: String(propertyKey),
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && value.trim() === value;
        },
      },
    });
  };
};

export const tokenRegex = /^[a-zA-Z0-9_-]{24}$/;

export const IsTokenValid = composePropertyDecorators(Matches(tokenRegex));
