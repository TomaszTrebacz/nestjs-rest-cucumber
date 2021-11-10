import { randomBytes, createHmac } from 'crypto';
import { promisify } from 'util';
import { CONFIG } from '@/config';

export const randomBytesAsync = promisify(randomBytes);

export const createRandomToken = async (): Promise<string> => {
  const buffer = await randomBytesAsync(18);

  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
};

export const hashString = (str: string): Buffer => {
  return createHmac('sha256', CONFIG.APP.SECRET).update(str).digest();
};

export const setDefault = <T>(
  value: T,
  defaultValue: Exclude<T, undefined>,
): Exclude<T, undefined> =>
  value === undefined ? defaultValue : (value as Exclude<T, undefined>);
