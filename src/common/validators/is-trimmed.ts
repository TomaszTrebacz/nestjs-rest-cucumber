import { registerDecorator, ValidationOptions } from 'class-validator';

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
