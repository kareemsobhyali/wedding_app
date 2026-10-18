import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        const response = context.switchToHttp().getResponse();
        
        // Do not wrap 204 No Content
        if (response.statusCode === 204) {
          return data;
        }
        
        // Do not wrap raw buffers/streams (e.g. file downloads)
        // Express res.send handles Buffers/Streams before they reach here usually, 
        // but if a controller returns a StreamableFile, we shouldn't wrap it.
        // A simple heuristic: if it looks like a stream, or it's a buffer, skip.
        if (data && (data instanceof Buffer || data.getStream)) {
          return data;
        }

        // Standard wrapper
        return {
          success: true,
          data: data !== undefined ? data : {},
        };
      }),
    );
  }
}
