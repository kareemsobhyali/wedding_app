import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred.';

    const requestId = request.id || 'N/A';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      
      // Map common HTTP exceptions
      if (status === HttpStatus.UNAUTHORIZED) errorCode = 'AUTH_UNAUTHORIZED';
      else if (status === HttpStatus.FORBIDDEN) errorCode = 'AUTH_FORBIDDEN';
      else if (status === HttpStatus.NOT_FOUND) errorCode = 'RESOURCE_NOT_FOUND';
      else if (status === HttpStatus.TOO_MANY_REQUESTS) errorCode = 'RATE_LIMITED';
      else if (status === HttpStatus.BAD_REQUEST) errorCode = 'VALIDATION_ERROR';

      // Use the exception's message if provided
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (exceptionResponse && typeof exceptionResponse.message === 'string') {
        message = exceptionResponse.message;
      } else if (exceptionResponse && Array.isArray(exceptionResponse.message)) {
        message = exceptionResponse.message[0]; // First validation error
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors securely without leaking raw SQL
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        errorCode = 'RESOURCE_CONFLICT';
        message = 'A resource with this unique field already exists.';
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        errorCode = 'RESOURCE_NOT_FOUND';
        message = 'The requested resource was not found.';
      }
    } else {
      // Unknown Error (Log it with Request ID for debugging, but hide from client)
      if (process.env.NODE_ENV !== 'test') {
        this.logger.error(`[RequestID: ${requestId}] Unhandled Exception: ${exception.message}`, exception.stack);
      }
    }

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message,
        requestId,
      },
    });
  }
}
