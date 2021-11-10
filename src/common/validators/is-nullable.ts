import { ValidateIf, ValidationOptions } from 'class-validator';

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
