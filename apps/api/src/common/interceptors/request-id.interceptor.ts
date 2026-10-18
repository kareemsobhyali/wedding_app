import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    let requestId = request.headers['x-request-id'];

    // Basic safety validation: alphanumeric + dashes, reasonable length
    if (!requestId || typeof requestId !== 'string' || requestId.length > 50 || !/^[a-zA-Z0-9-]+$/.test(requestId)) {
      requestId = uuidv4();
    }

    request.id = requestId;
    response.setHeader('X-Request-ID', requestId);

    return next.handle();
  }
}
