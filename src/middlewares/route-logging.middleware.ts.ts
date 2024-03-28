import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction, Response } from 'express';

@Injectable()
export class RouteLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('RouteLoggingMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const method = req.method;
    const url = req.baseUrl;

    res.on('close', () => {
      const end = Date.now();
      const totalTime = end - start;
      const statusCode = res.statusCode;

      this.logger.log(`${method} ${url} ${statusCode} ${totalTime}ms`);
    });

    next();
  }
}
