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
        authUserId: (req as any).user?.id,
      },
      res: {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
      },
      err: (res as any).err,
      responseTime,
    };

    if (res.statusCode >= 500) {
      logger.error(logData);
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      logger.warn(logData);
    } else {
      logger.info(logData);
    }
  });

  next();
};
