import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: any, response: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const start = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const time = Date.now() - start;
      const requestId = request.id || '-';

      this.logger.log(
        `[${requestId}] ${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${time}ms`
      );
    });

    next();
  }
}
