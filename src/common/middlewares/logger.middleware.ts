import { Request, Response, NextFunction } from 'express';
import { logger } from '@/common/logger';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestTime = Date.now();

  res.once('finish', () => {
    const responseTime = Date.now() - requestTime;
    const logData = {
      req: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        authUserId: (req as any).user?.id,
      },
      res: {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
      },
      err: res.err,
      responseTime,
    };

    if (res.statusCode >= 500) {
      logger.error(logData);
    } else if (res.statusCode >= 400) {
      logger.warn(logData);
    } else {
      logger.info(logData);
    }
  });

  next();
};
