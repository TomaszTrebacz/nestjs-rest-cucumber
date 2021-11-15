import { pino } from 'pino';
import { CONFIG } from '@/config';

export const logger = pino({
  level: CONFIG.APP.LOG_LEVEL,
  nestedKey: 'data',
  redact: [
    'data.req.headers.authorization',
    'data.req.body.password',
    'data.req.body.newPassword',
  ],
  serializers: {
    data(val) {
      if (val instanceof Error) {
        return pino.stdSerializers.err(val);
      }
      if (val?.errors) {
        val.errors = val.errors.map((err: Error) =>
          pino.stdSerializers.err(err),
        );
      }

      return val;
    },
  },
});
